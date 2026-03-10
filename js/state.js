export const app = {
  categories: [],
  currentCategory: "",
  currentEntries: [],
  cardIndex: [],
  selectedIndex: 0,
  _updateScheduled: false,

  // Used by global search "jump to category" so category load can preserve the search term.
  pendingJump: null, // { category: string, term: string } | null

  state: {
    credentialOnly: false,
    nonCredentialOnly: false,
    priorityOnly: false,
    favoritesOnly: false,
    fontScale: -1,
  },
};
