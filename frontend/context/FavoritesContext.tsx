"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { getFavorites, addFavorite, removeFavorite } from "@/lib/api";
import { FavoriteItem } from "@/types/favorite";

interface FavoritesContextType {
  favorites: FavoriteItem[];
  favoriteIds: Set<number>;
  isFavorite: (listingId: number) => boolean;
  toggleFavorite: (listingId: number) => Promise<boolean>;
  isLoading: boolean;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { currentUser, isLoaded: isAuthLoaded } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshFavorites = useCallback(async () => {
    if (!currentUser || !currentUser.id) return;
    setIsLoading(true);
    try {
      const data = await getFavorites(currentUser.id);
      setFavorites(data);
      setFavoriteIds(new Set(data.map((f) => f.listing_id)));
    } catch {
      // Backend error or network error — fail gracefully
      setFavorites([]);
      setFavoriteIds(new Set());
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (isAuthLoaded && currentUser) {
      refreshFavorites();
    }
  }, [isAuthLoaded, currentUser, refreshFavorites]);

  const isFavorite = useCallback(
    (listingId: number) => favoriteIds.has(listingId),
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    async (listingId: number): Promise<boolean> => {
      if (!currentUser || !currentUser.id) return false;

      const currentlyFavorited = favoriteIds.has(listingId);

      // Optimistic state update
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (currentlyFavorited) {
          next.delete(listingId);
        } else {
          next.add(listingId);
        }
        return next;
      });

      try {
        if (currentlyFavorited) {
          await removeFavorite(currentUser.id, listingId);
        } else {
          await addFavorite(currentUser.id, listingId);
        }
        // Background refresh to keep full FavoriteItem models up to date
        getFavorites(currentUser.id)
          .then((data) => {
            setFavorites(data);
            setFavoriteIds(new Set(data.map((f) => f.listing_id)));
          })
          .catch(() => {});
        return !currentlyFavorited;
      } catch (err) {
        // Roll back optimistic update on failure
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          if (currentlyFavorited) {
            next.add(listingId);
          } else {
            next.delete(listingId);
          }
          return next;
        });
        throw err;
      }
    },
    [currentUser, favoriteIds]
  );

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoriteIds,
        isFavorite,
        toggleFavorite,
        isLoading,
        refreshFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextType {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
