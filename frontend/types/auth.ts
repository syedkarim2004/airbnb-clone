export type UserRole = "guest" | "host" | "both";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

/**
 * Pre-seeded users in backend airbnb.db for development mock auth.
 */
export const SEEDED_USERS: User[] = [
  // Guests
  { id: 3, name: "Carol Davis", email: "carol@example.com", role: "guest" },
  { id: 10, name: "Marcus Vance", email: "marcus.vance@example.com", role: "guest" },
  { id: 11, name: "Sophia Dubois", email: "sophia.dubois@example.com", role: "guest" },
  { id: 12, name: "Ananya Patel", email: "ananya.patel@example.com", role: "guest" },
  { id: 13, name: "Liam O'Connor", email: "liam.oconnor@example.com", role: "guest" },

  // Hosts
  { id: 1, name: "Alice Martin", email: "alice@example.com", role: "host" },
  { id: 2, name: "Bob Chen", email: "bob@example.com", role: "host" },
  { id: 5, name: "Priya Sharma", email: "priya.sharma@example.com", role: "host" },
  { id: 6, name: "Vikram Malhotra", email: "vikram.malhotra@example.com", role: "host" },
  { id: 7, name: "Elena Rossi", email: "elena.rossi@example.com", role: "host" },
  { id: 8, name: "Kenji Sato", email: "kenji.sato@example.com", role: "host" },

  // Both
  { id: 4, name: "David Wilson", email: "david@example.com", role: "both" },
  { id: 9, name: "Rohan Mehra", email: "rohan.mehra@example.com", role: "both" },
];
