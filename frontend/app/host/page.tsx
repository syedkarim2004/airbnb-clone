"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import {
  getHostListings,
  createHostListing,
  updateHostListing,
  deleteHostListing,
  reactivateHostListing,
  getHostBookings,
  getAmenities,
  uploadHostPhotos,
  getImageUrl,
} from "@/lib/api";
import { HostListing, HostBooking, HostListingCreate, HostListingUpdate } from "@/types/host";
import styles from "./page.module.css";

const DEFAULT_AMENITY_NAMES = [
  "WiFi",
  "Kitchen",
  "Air Conditioning",
  "Heating",
  "Pool",
  "Free Parking",
  "Washer",
  "TV",
  "Dedicated Workspace",
];

export default function HostDashboardPage() {
  const { currentUser, isHost, switchUserById } = useAuth();

  const [activeTab, setActiveTab] = useState<"listings" | "reservations">("listings");
  const [listings, setListings] = useState<HostListing[]>([]);
  const [bookings, setBookings] = useState<HostBooking[]>([]);
  const [availableAmenities, setAvailableAmenities] = useState<string[]>(DEFAULT_AMENITY_NAMES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal States
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalListing, setEditModalListing] = useState<HostListing | null>(null);

  // Form states for creation
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newCountry, setNewCountry] = useState("");
  const [newPrice, setNewPrice] = useState("120");
  const [newCleaningFee, setNewCleaningFee] = useState("25");
  const [newMaxGuests, setNewMaxGuests] = useState("2");
  const [newImages, setNewImages] = useState<string[]>([]);
  const [newImageUrlInput, setNewImageUrlInput] = useState("");
  const [newAmenities, setNewAmenities] = useState<string[]>([]);
  const [submittingCreate, setSubmittingCreate] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [uploadingCreate, setUploadingCreate] = useState(false);
  const [uploadErrorCreate, setUploadErrorCreate] = useState<string | null>(null);
  const createFileInputRef = React.useRef<HTMLInputElement>(null);

  // Form states for editing
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCleaningFee, setEditCleaningFee] = useState("");
  const [editMaxGuests, setEditMaxGuests] = useState("");
  const [editImages, setEditImages] = useState<string[]>([]);
  const [editImageUrlInput, setEditImageUrlInput] = useState("");
  const [editAmenities, setEditAmenities] = useState<string[]>([]);
  const [submittingEdit, setSubmittingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [uploadingEdit, setUploadingEdit] = useState(false);
  const [uploadErrorEdit, setUploadErrorEdit] = useState<string | null>(null);
  const editFileInputRef = React.useRef<HTMLInputElement>(null);

  // Fetch available amenities on mount
  useEffect(() => {
    getAmenities()
      .then((amenities) => {
        if (amenities && amenities.length > 0) {
          setAvailableAmenities(amenities);
        }
      })
      .catch(() => {
        // Fallback to DEFAULT_AMENITY_NAMES if backend amenities endpoint unavailable
      });
  }, []);

  const fetchHostData = useCallback(async () => {
    if (!currentUser || !isHost) return;
    setLoading(true);
    setError(null);
    try {
      const [listingsData, bookingsData] = await Promise.all([
        getHostListings(currentUser.id),
        getHostBookings(currentUser.id),
      ]);
      setListings(listingsData);
      setBookings(bookingsData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load host data");
    } finally {
      setLoading(false);
    }
  }, [currentUser, isHost]);

  useEffect(() => {
    fetchHostData();
  }, [fetchHostData]);

  // Derived metrics
  const totalListings = listings.length;
  const activeListings = useMemo(
    () => listings.filter((l) => l.is_active).length,
    [listings]
  );
  const totalBookingsCount = useMemo(
    () => listings.reduce((sum, l) => sum + (l.booking_count || 0), 0),
    [listings]
  );
  const totalRevenueSum = useMemo(
    () => listings.reduce((sum, l) => sum + (l.total_revenue || 0), 0),
    [listings]
  );

  // Deactivate listing (Soft Delete)
  const handleDeactivate = async (listingId: number) => {
    if (!currentUser) return;
    try {
      await deleteHostListing(currentUser.id, listingId);
      setListings((prev) =>
        prev.map((l) => (l.id === listingId ? { ...l, is_active: false } : l))
      );
      setSuccessMessage(`Listing #${listingId} deactivated. It is now hidden from public search.`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to deactivate listing");
    }
  };

  // Reactivate listing
  const handleReactivate = async (listingId: number) => {
    if (!currentUser) return;
    try {
      await reactivateHostListing(currentUser.id, listingId);
      setListings((prev) =>
        prev.map((l) => (l.id === listingId ? { ...l, is_active: true } : l))
      );
      setSuccessMessage(`Listing #${listingId} reactivated and visible in public searches!`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to reactivate listing");
    }
  };

  // Real Photo Upload Handlers
  const handleUploadCreateFiles = async (files: FileList | null) => {
    if (!files || files.length === 0 || !currentUser) return;
    setUploadingCreate(true);
    setUploadErrorCreate(null);
    try {
      const fileArray = Array.from(files);
      const urls = await uploadHostPhotos(currentUser.id, fileArray);
      setNewImages((prev) => [...prev, ...urls]);
    } catch (err: unknown) {
      setUploadErrorCreate(err instanceof Error ? err.message : "Failed to upload photos");
    } finally {
      setUploadingCreate(false);
      if (createFileInputRef.current) createFileInputRef.current.value = "";
    }
  };

  const handleUploadEditFiles = async (files: FileList | null) => {
    if (!files || files.length === 0 || !currentUser) return;
    setUploadingEdit(true);
    setUploadErrorEdit(null);
    try {
      const fileArray = Array.from(files);
      const urls = await uploadHostPhotos(currentUser.id, fileArray);
      setEditImages((prev) => [...prev, ...urls]);
    } catch (err: unknown) {
      setUploadErrorEdit(err instanceof Error ? err.message : "Failed to upload photos");
    } finally {
      setUploadingEdit(false);
      if (editFileInputRef.current) editFileInputRef.current.value = "";
    }
  };

  const handleMoveImage = (index: number, direction: "left" | "right", isEdit: boolean) => {
    const setter = isEdit ? setEditImages : setNewImages;
    setter((prev) => {
      const nextIndex = direction === "left" ? index - 1 : index + 1;
      if (nextIndex < 0 || nextIndex >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[nextIndex];
      copy[nextIndex] = temp;
      return copy;
    });
  };

  // Image & Amenity Handlers for Create
  const handleAddImage = () => {
    const trimmed = newImageUrlInput.trim();
    if (!trimmed) return;
    setNewImages((prev) => [...prev, trimmed]);
    setNewImageUrlInput("");
  };

  const handleRemoveImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToggleAmenity = (name: string) => {
    setNewAmenities((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  // Image & Amenity Handlers for Edit
  const handleAddEditImage = () => {
    const trimmed = editImageUrlInput.trim();
    if (!trimmed) return;
    setEditImages((prev) => [...prev, trimmed]);
    setEditImageUrlInput("");
  };

  const handleRemoveEditImage = (index: number) => {
    setEditImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToggleEditAmenity = (name: string) => {
    setEditAmenities((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  // Open Edit Modal
  const openEditModal = (listing: HostListing) => {
    setEditModalListing(listing);
    setEditTitle(listing.title);
    setEditDesc(listing.description);
    setEditPrice(listing.price_per_night.toString());
    setEditCleaningFee(listing.cleaning_fee.toString());
    setEditMaxGuests(listing.max_guests.toString());
    setEditImages(listing.images ? [...listing.images] : []);
    setEditImageUrlInput("");
    setEditAmenities(listing.amenities ? [...listing.amenities] : []);
    setEditError(null);
    setUploadErrorEdit(null);
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !editModalListing) return;
    setSubmittingEdit(true);
    setEditError(null);

    const patchPayload: HostListingUpdate = {
      title: editTitle.trim(),
      description: editDesc.trim(),
      price_per_night: parseFloat(editPrice),
      cleaning_fee: parseFloat(editCleaningFee),
      max_guests: parseInt(editMaxGuests, 10),
      images: editImages,
      amenities: editAmenities,
    };

    try {
      const updated = await updateHostListing(
        currentUser.id,
        editModalListing.id,
        patchPayload
      );
      setListings((prev) =>
        prev.map((l) => (l.id === editModalListing.id ? { ...l, ...updated } : l))
      );
      setEditModalListing(null);
      setSuccessMessage("Listing details updated successfully!");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: unknown) {
      setEditError(err instanceof Error ? err.message : "Failed to update listing");
    } finally {
      setSubmittingEdit(false);
    }
  };

  // Handle Create Submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSubmittingCreate(true);
    setCreateError(null);

    const payload: HostListingCreate = {
      title: newTitle.trim(),
      description: newDesc.trim(),
      city: newCity.trim(),
      country: newCountry.trim(),
      price_per_night: parseFloat(newPrice),
      cleaning_fee: parseFloat(newCleaningFee),
      max_guests: parseInt(newMaxGuests, 10),
      images: newImages,
      amenities: newAmenities,
    };

    try {
      const created = await createHostListing(currentUser.id, payload);
      setListings((prev) => [created, ...prev]);
      setCreateModalOpen(false);
      // Reset form
      setNewTitle("");
      setNewDesc("");
      setNewCity("");
      setNewCountry("");
      setNewImages([]);
      setNewImageUrlInput("");
      setNewAmenities([]);
      setSuccessMessage("New listing created successfully!");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: unknown) {
      setCreateError(err instanceof Error ? err.message : "Failed to create listing");
    } finally {
      setSubmittingCreate(false);
    }
  };

  return (
    <div className={styles.main}>
      <Header
        activeTab="homes"
        onTabChange={() => {}}
        showCompactAlways
      />

      <main className={styles.container}>
        {/* Role Access Check */}
        {!isHost ? (
          <div className={styles.restrictedBox}>
            <h2 className={styles.restrictedTitle}>Host Privileges Required</h2>
            <p className={styles.restrictedText}>
              Your current mock user <strong>{currentUser.name}</strong> has role{" "}
              <code>{currentUser.role}</code>. The Host Dashboard is restricted to
              users with role <code>host</code> or <code>both</code>.
            </p>
            <p style={{ fontSize: "0.88rem", color: "#555", marginBottom: "1.5rem" }}>
              Switch to a pre-seeded host user to test host dashboard features:
            </p>
            <div className={styles.hostSwitcherRow}>
              <button
                type="button"
                className={styles.switchHostBtn}
                onClick={() => switchUserById(1)}
              >
                Switch to Alice Martin (Host)
              </button>
              <button
                type="button"
                className={styles.switchHostBtn}
                onClick={() => switchUserById(4)}
              >
                Switch to David Wilson (Both)
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header row */}
            <div className={styles.headerRow}>
              <div>
                <h1 className={styles.title}>Host Dashboard</h1>
                <p className={styles.subtitle}>
                  Managing listings for <strong>{currentUser.name}</strong> ({currentUser.role})
                </p>
              </div>

              <button
                type="button"
                className={styles.createBtn}
                onClick={() => setCreateModalOpen(true)}
              >
                <span>+</span> Create New Listing
              </button>
            </div>

            {successMessage && (
              <div className={styles.successAlert}>{successMessage}</div>
            )}

            {/* Metrics Grid */}
            <div className={styles.metricsGrid}>
              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>Total Properties</span>
                <span className={styles.metricValue}>{totalListings}</span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>Active on Airbnb</span>
                <span className={styles.metricValue}>{activeListings}</span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>Total Bookings</span>
                <span className={styles.metricValue}>{totalBookingsCount}</span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>Total Gross Revenue</span>
                <span className={styles.metricValue}>${totalRevenueSum.toFixed(2)}</span>
              </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabsRow}>
              <button
                type="button"
                className={`${styles.tabBtn} ${
                  activeTab === "listings" ? styles.tabBtnActive : ""
                }`}
                onClick={() => setActiveTab("listings")}
              >
                Your Listings ({listings.length})
              </button>
              <button
                type="button"
                className={`${styles.tabBtn} ${
                  activeTab === "reservations" ? styles.tabBtnActive : ""
                }`}
                onClick={() => setActiveTab("reservations")}
              >
                Guest Reservations ({bookings.length})
              </button>
            </div>

            {/* Content Tabs */}
            {loading ? (
              <div className={styles.emptyBox}>Loading host data...</div>
            ) : error ? (
              <div className={styles.errorAlert}>{error}</div>
            ) : activeTab === "listings" ? (
              <div className={styles.listingsList}>
                {listings.length === 0 ? (
                  <div className={styles.emptyBox}>
                    You haven&apos;t created any listings yet. Click &quot;Create New Listing&quot; to get started.
                  </div>
                ) : (
                  listings.map((l) => (
                    <div key={l.id} className={styles.listingRow}>
                      <div className={styles.listingThumbWrapper}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            l.images && l.images.length > 0
                              ? l.images[0]
                              : "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80"
                          }
                          alt={l.title}
                          className={styles.listingThumb}
                        />
                      </div>

                      <div className={styles.listingMainInfo}>
                        <div className={styles.listingTitleRow}>
                          <h3 className={styles.listingTitle}>{l.title}</h3>
                          <span
                            className={`${styles.statusBadge} ${
                              l.is_active ? styles.statusActive : styles.statusInactive
                            }`}
                          >
                            {l.is_active ? "Active" : "Deactivated"}
                          </span>
                        </div>

                        <div className={styles.listingLocation}>
                          {l.city}, {l.country} · ${l.price_per_night}/night · Max {l.max_guests} guests
                        </div>

                        <div className={styles.listingStatsRow}>
                          <div>
                            Bookings: <span className={styles.listingStat}>{l.booking_count}</span>
                          </div>
                          <div>
                            Earnings: <span className={styles.listingStat}>${l.total_revenue.toFixed(2)}</span>
                          </div>
                          <div>
                            Cleaning fee: <span className={styles.listingStat}>${l.cleaning_fee}</span>
                          </div>
                        </div>
                      </div>

                      <div className={styles.listingActions}>
                        <Link
                          href={`/listings/${l.id}`}
                          className={styles.actionBtnSecondary}
                          target="_blank"
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          className={styles.actionBtnSecondary}
                          onClick={() => openEditModal(l)}
                        >
                          Edit
                        </button>
                        {l.is_active ? (
                          <button
                            type="button"
                            className={styles.actionBtnDanger}
                            onClick={() => handleDeactivate(l.id)}
                            title="Soft delete: hides listing from search, preserves booking records"
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            type="button"
                            className={styles.actionBtnSuccess}
                            onClick={() => handleReactivate(l.id)}
                          >
                            Reactivate
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              /* Reservations Tab */
              <div className={styles.bookingsCard}>
                {bookings.length === 0 ? (
                  <div className={styles.emptyBox}>No bookings received yet.</div>
                ) : (
                  <div className={styles.tableWrapper}>
                    <table className={styles.bookingsTable}>
                      <thead>
                        <tr>
                          <th>Confirmation</th>
                          <th>Listing</th>
                          <th>Guest Name</th>
                          <th>Check-in</th>
                          <th>Check-out</th>
                          <th>Nights</th>
                          <th>Total Payout</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((b) => (
                          <tr key={b.id}>
                            <td>
                              <strong>#BK-{b.id}</strong>
                            </td>
                            <td>{b.listing_title}</td>
                            <td>{b.guest_name}</td>
                            <td>{b.check_in}</td>
                            <td>{b.check_out}</td>
                            <td>{b.nights}</td>
                            <td>
                              <strong>${b.total_price.toFixed(2)}</strong>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* CREATE LISTING MODAL */}
      {createModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setCreateModalOpen(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Create New Listing</h2>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setCreateModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              <div className={styles.modalBody}>
                {createError && <div className={styles.errorAlert}>{createError}</div>}

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Title</label>
                  <input
                    type="text"
                    required
                    className={styles.formInput}
                    placeholder="e.g. Sunny Modern Loft in Central District"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Description</label>
                  <textarea
                    required
                    className={styles.formInput}
                    rows={3}
                    placeholder="Describe your property, space, and unique features..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>City</label>
                    <input
                      type="text"
                      required
                      className={styles.formInput}
                      placeholder="e.g. Paris"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Country</label>
                    <input
                      type="text"
                      required
                      className={styles.formInput}
                      placeholder="e.g. France"
                      value={newCountry}
                      onChange={(e) => setNewCountry(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Price Per Night ($)</label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      required
                      className={styles.formInput}
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Cleaning Fee ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      required
                      className={styles.formInput}
                      value={newCleaningFee}
                      onChange={(e) => setNewCleaningFee(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Max Guests</label>
                  <input
                    type="number"
                    min="1"
                    max="16"
                    required
                    className={styles.formInput}
                    value={newMaxGuests}
                    onChange={(e) => setNewMaxGuests(e.target.value)}
                  />
                </div>

                {/* Photos Upload & Management */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Listing Photos</label>
                  <p className={styles.formHelpText}>
                    Upload high quality photos from your computer. The first photo is your main Cover photo (position 0).
                  </p>

                  {/* Upload Dropzone Button */}
                  <input
                    type="file"
                    ref={createFileInputRef}
                    className={styles.hiddenFileInput}
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => handleUploadCreateFiles(e.target.files)}
                  />

                  <div
                    className={styles.uploadDropzone}
                    onClick={() => createFileInputRef.current?.click()}
                  >
                    <span className={styles.uploadIcon}>📷</span>
                    <span className={styles.uploadText}>
                      {uploadingCreate ? "Uploading photos..." : "Choose photos from your computer"}
                    </span>
                    <span className={styles.uploadSubtext}>
                      Supports JPG, PNG, and WebP (up to 10MB each)
                    </span>
                  </div>

                  {uploadingCreate && (
                    <div className={styles.uploadingSpinner}>
                      <span>⏳</span> Uploading and saving photos to persistent storage...
                    </div>
                  )}

                  {uploadErrorCreate && (
                    <div className={styles.errorAlert}>{uploadErrorCreate}</div>
                  )}

                  {/* Photo Preview Grid with Reorder and Cover Badge */}
                  {newImages.length > 0 && (
                    <div className={styles.photoGrid}>
                      {newImages.map((url, idx) => (
                        <div
                          key={`new-img-${idx}`}
                          className={`${styles.photoCard} ${idx === 0 ? styles.photoCardCover : ""}`}
                        >
                          {idx === 0 ? (
                            <span className={styles.coverBadge}>★ Cover</span>
                          ) : (
                            <span className={styles.photoOrderBadge}>#{idx + 1}</span>
                          )}

                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getImageUrl(url)}
                            alt={`Photo ${idx + 1}`}
                            className={styles.photoThumb}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300";
                            }}
                          />

                          <div className={styles.photoControls}>
                            <button
                              type="button"
                              className={styles.photoOrderBtn}
                              disabled={idx === 0}
                              onClick={() => handleMoveImage(idx, "left", false)}
                              title="Move photo left (higher priority)"
                            >
                              ←
                            </button>
                            <button
                              type="button"
                              className={styles.photoOrderBtn}
                              disabled={idx === newImages.length - 1}
                              onClick={() => handleMoveImage(idx, "right", false)}
                              title="Move photo right"
                            >
                              →
                            </button>
                            <button
                              type="button"
                              className={styles.photoDeleteBtn}
                              onClick={() => handleRemoveImage(idx)}
                              title="Remove photo"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Fallback URL row */}
                  <div style={{ marginTop: "10px" }}>
                    <div className={styles.imageInputRow}>
                      <input
                        type="url"
                        className={styles.formInput}
                        placeholder="Or paste an image URL (e.g. Unsplash)..."
                        value={newImageUrlInput}
                        onChange={(e) => setNewImageUrlInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddImage();
                          }
                        }}
                      />
                      <button
                        type="button"
                        className={styles.addImageBtn}
                        onClick={handleAddImage}
                      >
                        + Add URL
                      </button>
                    </div>
                  </div>
                </div>

                {/* Amenities Selection */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Amenities</label>
                  <p className={styles.formHelpText}>
                    Select all amenities available at this property:
                  </p>
                  <div className={styles.amenitiesGrid}>
                    {availableAmenities.map((amenity) => {
                      const isSelected = newAmenities.includes(amenity);
                      return (
                        <label
                          key={amenity}
                          className={`${styles.amenityCheckboxLabel} ${
                            isSelected ? styles.amenityCheckboxActive : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            className={styles.amenityCheckbox}
                            checked={isSelected}
                            onChange={() => handleToggleAmenity(amenity)}
                          />
                          <span>{amenity}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setCreateModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={submittingCreate}
                >
                  {submittingCreate ? "Creating..." : "Publish Listing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT LISTING MODAL */}
      {editModalListing && (
        <div className={styles.modalOverlay} onClick={() => setEditModalListing(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Edit Listing #{editModalListing.id}</h2>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setEditModalListing(null)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className={styles.modalBody}>
                {editError && <div className={styles.errorAlert}>{editError}</div>}

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Title</label>
                  <input
                    type="text"
                    required
                    className={styles.formInput}
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Description</label>
                  <textarea
                    required
                    className={styles.formInput}
                    rows={3}
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Price Per Night ($)</label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      required
                      className={styles.formInput}
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Cleaning Fee ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      required
                      className={styles.formInput}
                      value={editCleaningFee}
                      onChange={(e) => setEditCleaningFee(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Max Guests</label>
                  <input
                    type="number"
                    min="1"
                    max="16"
                    required
                    className={styles.formInput}
                    value={editMaxGuests}
                    onChange={(e) => setEditMaxGuests(e.target.value)}
                  />
                </div>

                {/* Edit Photos Upload & Management */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Listing Photos</label>
                  <p className={styles.formHelpText}>
                    Upload new photos or reorder existing ones. The first photo is the Cover photo (position 0).
                  </p>

                  <input
                    type="file"
                    ref={editFileInputRef}
                    className={styles.hiddenFileInput}
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => handleUploadEditFiles(e.target.files)}
                  />

                  <div
                    className={styles.uploadDropzone}
                    onClick={() => editFileInputRef.current?.click()}
                  >
                    <span className={styles.uploadIcon}>📷</span>
                    <span className={styles.uploadText}>
                      {uploadingEdit ? "Uploading photos..." : "Choose photos from your computer"}
                    </span>
                    <span className={styles.uploadSubtext}>
                      Supports JPG, PNG, and WebP (up to 10MB each)
                    </span>
                  </div>

                  {uploadingEdit && (
                    <div className={styles.uploadingSpinner}>
                      <span>⏳</span> Uploading and saving photos to persistent storage...
                    </div>
                  )}

                  {uploadErrorEdit && (
                    <div className={styles.errorAlert}>{uploadErrorEdit}</div>
                  )}

                  {editImages.length > 0 && (
                    <div className={styles.photoGrid}>
                      {editImages.map((url, idx) => (
                        <div
                          key={`edit-img-${idx}`}
                          className={`${styles.photoCard} ${idx === 0 ? styles.photoCardCover : ""}`}
                        >
                          {idx === 0 ? (
                            <span className={styles.coverBadge}>★ Cover</span>
                          ) : (
                            <span className={styles.photoOrderBadge}>#{idx + 1}</span>
                          )}

                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getImageUrl(url)}
                            alt={`Photo ${idx + 1}`}
                            className={styles.photoThumb}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300";
                            }}
                          />

                          <div className={styles.photoControls}>
                            <button
                              type="button"
                              className={styles.photoOrderBtn}
                              disabled={idx === 0}
                              onClick={() => handleMoveImage(idx, "left", true)}
                              title="Move photo left (higher priority)"
                            >
                              ←
                            </button>
                            <button
                              type="button"
                              className={styles.photoOrderBtn}
                              disabled={idx === editImages.length - 1}
                              onClick={() => handleMoveImage(idx, "right", true)}
                              title="Move photo right"
                            >
                              →
                            </button>
                            <button
                              type="button"
                              className={styles.photoDeleteBtn}
                              onClick={() => handleRemoveEditImage(idx)}
                              title="Remove photo"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ marginTop: "10px" }}>
                    <div className={styles.imageInputRow}>
                      <input
                        type="url"
                        className={styles.formInput}
                        placeholder="Or paste an image URL (e.g. Unsplash)..."
                        value={editImageUrlInput}
                        onChange={(e) => setEditImageUrlInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddEditImage();
                          }
                        }}
                      />
                      <button
                        type="button"
                        className={styles.addImageBtn}
                        onClick={handleAddEditImage}
                      >
                        + Add URL
                      </button>
                    </div>
                  </div>
                </div>

                {/* Edit Amenities Selection */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Amenities</label>
                  <p className={styles.formHelpText}>
                    Select all amenities available at this property:
                  </p>
                  <div className={styles.amenitiesGrid}>
                    {availableAmenities.map((amenity) => {
                      const isSelected = editAmenities.includes(amenity);
                      return (
                        <label
                          key={amenity}
                          className={`${styles.amenityCheckboxLabel} ${
                            isSelected ? styles.amenityCheckboxActive : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            className={styles.amenityCheckbox}
                            checked={isSelected}
                            onChange={() => handleToggleEditAmenity(amenity)}
                          />
                          <span>{amenity}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setEditModalListing(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={submittingEdit}
                >
                  {submittingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
