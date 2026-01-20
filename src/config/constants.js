// Environment variables utility
// All React environment variables must start with REACT_APP_

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
  TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000,
};

// UI Text Constants
export const UI_TEXT = {
  // General
  APP_TITLE: process.env.REACT_APP_APP_TITLE || 'Project Collection',
  LOADING: process.env.REACT_APP_LOADING_TEXT || 'Loading...',
  ERROR: process.env.REACT_APP_ERROR_TEXT || 'An error occurred',
  RETRY: process.env.REACT_APP_RETRY_TEXT || 'Retry',
  SAVE: process.env.REACT_APP_SAVE_TEXT || 'Save',
  CANCEL: process.env.REACT_APP_CANCEL_TEXT || 'Cancel',
  DELETE: process.env.REACT_APP_DELETE_TEXT || 'Delete',
  EDIT: process.env.REACT_APP_EDIT_TEXT || 'Edit',
  ADD: process.env.REACT_APP_ADD_TEXT || 'Add',
  CLOSE: process.env.REACT_APP_CLOSE_TEXT || 'Close',

  // Form Labels
  TITLE: process.env.REACT_APP_TITLE_LABEL || 'Title',
  GENRE: process.env.REACT_APP_GENRE_LABEL || 'Genre',
  STATUS: process.env.REACT_APP_STATUS_LABEL || 'Status',
  RATING: process.env.REACT_APP_RATING_LABEL || 'Rating',
  COMMENT: process.env.REACT_APP_COMMENT_LABEL || 'Comment',
  YEAR: process.env.REACT_APP_YEAR_LABEL || 'Year',
  DIRECTOR: process.env.REACT_APP_DIRECTOR_LABEL || 'Director',
  AUTHOR: process.env.REACT_APP_AUTHOR_LABEL || 'Author',
  PLATFORM: process.env.REACT_APP_PLATFORM_LABEL || 'Platform',
  IMAGE: process.env.REACT_APP_IMAGE_LABEL || 'Image',

  // Rating Section Label
  RATING_SECTION: process.env.REACT_APP_RATING_SECTION_LABEL || 'Rating',
};

// Status Options
export const STATUS_OPTIONS = {
  MOVIES: [
    { value: 'planned', label: process.env.REACT_APP_STATUS_PLANNED_SERIES || 'Plan to Watch' },
    { value: 'watching', label: process.env.REACT_APP_STATUS_WATCHING || 'Watching' },
    { value: 'completed', label: process.env.REACT_APP_STATUS_COMPLETED || 'Completed' },
    { value: 'dropped', label: process.env.REACT_APP_STATUS_DROPPED || 'Dropped' },
  ],
  BOOKS: [
    { value: 'planned', label: process.env.REACT_APP_STATUS_PLANNED_BOOK || 'Plan to Read' },
    { value: 'reading', label: process.env.REACT_APP_STATUS_READING || 'Reading' },
    { value: 'completed', label: process.env.REACT_APP_STATUS_READ || 'Completed' },
    { value: 'dropped', label: process.env.REACT_APP_STATUS_DROPPED || 'Dropped' },
  ],
  GAMES: [
    { value: 'planned', label: process.env.REACT_APP_STATUS_PLANNED_GAME || 'Plan to Play' },
    { value: 'playing', label: process.env.REACT_APP_STATUS_PLAYING || 'Playing' },
    { value: 'completed', label: process.env.REACT_APP_STATUS_PLAYED || 'Completed' },
    { value: 'dropped', label: process.env.REACT_APP_STATUS_DROPPED || 'Dropped' },
  ],
};

// Dashboard Titles
export const DASHBOARD_TITLES = {
  BOOKS: process.env.REACT_APP_BOOKS_DASHBOARD_TITLE || 'Book Collection',
  MOVIES: process.env.REACT_APP_MOVIES_DASHBOARD_TITLE || 'Movies/Series Collection',
  GAMES: process.env.REACT_APP_GAMES_DASHBOARD_TITLE || 'Game Collection',
};

// Modal Titles
export const MODAL_TITLES = {
  ADD_BOOK: process.env.REACT_APP_ADD_BOOK_MODAL_TITLE || 'Add New Book',
  ADD_MOVIE: process.env.REACT_APP_ADD_MOVIE_MODAL_TITLE || 'Add New Movie/Series',
  ADD_GAME: process.env.REACT_APP_ADD_GAME_MODAL_TITLE || 'Add New Game',
  EDIT_BOOK: process.env.REACT_APP_EDIT_BOOK_MODAL_TITLE || 'Edit Book',
  EDIT_MOVIE: process.env.REACT_APP_EDIT_MOVIE_MODAL_TITLE || 'Edit Movie/Series',
  EDIT_GAME: process.env.REACT_APP_EDIT_GAME_MODAL_TITLE || 'Edit Game',
};

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: process.env.REACT_APP_ERROR_REQUIRED_FIELD || 'This field is required',
  GENRE_REQUIRED: process.env.REACT_APP_ERROR_GENRE_REQUIRED || 'Please select a genre!',
  DUPLICATE_TITLE: {
    MOVIE: process.env.REACT_APP_ERROR_DUPLICATE_TITLE_MOVIE || 'A movie/series with this name already exists!',
    GAME: process.env.REACT_APP_ERROR_DUPLICATE_TITLE_GAME || 'A game with this name already exists!',
    BOOK: process.env.REACT_APP_ERROR_DUPLICATE_TITLE_BOOK || 'A book with this name already exists!',
  },
  FILE_UPLOAD: process.env.REACT_APP_ERROR_FILE_UPLOAD || 'File upload error!',
  FILE_TOO_LARGE: process.env.REACT_APP_ERROR_FILE_TOO_LARGE || 'File size is too large. Maximum 5MB allowed.',
  ADDING_PROJECT: process.env.REACT_APP_ERROR_ADDING_PROJECT || 'Error adding project',
  UPDATING_PROJECT: process.env.REACT_APP_ERROR_UPDATING_PROJECT || 'Error updating project',
  DELETING_PROJECT: process.env.REACT_APP_ERROR_DELETING_PROJECT || 'Error deleting project',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  PROJECT_ADDED: process.env.REACT_APP_SUCCESS_PROJECT_ADDED || 'Project added successfully',
  PROJECT_UPDATED: process.env.REACT_APP_SUCCESS_PROJECT_UPDATED || 'Project updated successfully',
  PROJECT_DELETED: process.env.REACT_APP_SUCCESS_PROJECT_DELETED || 'Project deleted successfully',
};

// Empty State Messages
export const EMPTY_STATE_MESSAGES = {
  BOOKS: process.env.REACT_APP_EMPTY_BOOKS_MESSAGE || 'No books added yet',
  MOVIES: process.env.REACT_APP_EMPTY_MOVIES_MESSAGE || 'No movies/series added yet',
  GAMES: process.env.REACT_APP_EMPTY_GAMES_MESSAGE || 'No games added yet',
  DESCRIPTION: process.env.REACT_APP_EMPTY_STATE_DESCRIPTION || 'Click the + button to add a new project',
  NO_ITEMS: process.env.REACT_APP_NO_ITEMS || 'No content added yet',
};

// Chart Titles
export const CHART_TITLES = {
  GENRE: process.env.REACT_APP_CHART_GENRE_TITLE || 'Distribution by Genre',
  STATUS: process.env.REACT_APP_CHART_STATUS_TITLE || 'Distribution by Status',
};

// Navigation
export const NAVIGATION = {
  BOOKS: process.env.REACT_APP_NAV_BOOKS || 'Books',
  MOVIES: process.env.REACT_APP_NAV_MOVIES || 'Movies/Series',
  GAMES: process.env.REACT_APP_NAV_GAMES || 'Games',
  HOME: process.env.REACT_APP_NAV_HOME || 'Home',
};

// Image Upload
export const IMAGE_UPLOAD = {
  TEXT: process.env.REACT_APP_IMAGE_UPLOAD_TEXT || 'Upload Image',
  UPLOADING: process.env.REACT_APP_IMAGE_UPLOADING_TEXT || 'Uploading...',
  DESC: process.env.REACT_APP_IMAGE_UPLOAD_DESC || 'JPG, PNG or GIF format',
  NO_IMAGE: process.env.REACT_APP_NO_IMAGE_TEXT || 'No image uploaded',
};

// Delete Dialog
export const DELETE_DIALOG = {
  TITLE: {
    BOOK: process.env.REACT_APP_DELETE_DIALOG_TITLE_BOOK || 'Delete Book',
    GAME: process.env.REACT_APP_DELETE_DIALOG_TITLE_GAME || 'Delete Game',
    MOVIE: process.env.REACT_APP_DELETE_DIALOG_TITLE_MOVIE || 'Delete Movie/Series',
  },
  CONTENT: {
    BOOK: process.env.REACT_APP_DELETE_DIALOG_CONTENT_BOOK || 'Are you sure you want to delete this book?',
    GAME: process.env.REACT_APP_DELETE_DIALOG_CONTENT_GAME || 'Are you sure you want to delete this game?',
    MOVIE: process.env.REACT_APP_DELETE_DIALOG_CONTENT_MOVIE || 'Are you sure you want to delete this movie/series?',
  },
  CANCEL: process.env.REACT_APP_DELETE_DIALOG_CANCEL || 'Cancel',
  CONFIRM: process.env.REACT_APP_DELETE_DIALOG_CONFIRM || 'Delete',
};

// Card Labels
export const CARD_LABELS = {
  GENRE: process.env.REACT_APP_CARD_GENRE || 'Genre:',
  AUTHOR: process.env.REACT_APP_CARD_AUTHOR || 'Author:',
  DIRECTOR: process.env.REACT_APP_CARD_DIRECTOR || 'Director:',
  PLATFORM: process.env.REACT_APP_CARD_PLATFORM || 'Platform:',
  DEVELOPER: process.env.REACT_APP_CARD_DEVELOPER || 'Developer:',
  YEAR: process.env.REACT_APP_CARD_YEAR || 'Year:',
  COMMENT: process.env.REACT_APP_CARD_COMMENT || 'Comment:',
  EDIT: process.env.REACT_APP_CARD_EDIT || 'Edit',
  DELETE: process.env.REACT_APP_CARD_DELETE || 'Delete',
};

// Genres
export const GENRES = {
  // Movies/Series
  ACTION: process.env.REACT_APP_GENRE_ACTION || 'Action',
  COMEDY: process.env.REACT_APP_GENRE_COMEDY || 'Comedy',
  DRAMA: process.env.REACT_APP_GENRE_DRAMA || 'Drama',
  HORROR: process.env.REACT_APP_GENRE_HORROR || 'Horror',
  SCIFI: process.env.REACT_APP_GENRE_SCIFI || 'Sci-Fi',
  ROMANCE: process.env.REACT_APP_GENRE_ROMANCE || 'Romance',
  THRILLER: process.env.REACT_APP_GENRE_THRILLER || 'Thriller',
  ANIMATION: process.env.REACT_APP_GENRE_ANIMATION || 'Animation',
  DOCUMENTARY: process.env.REACT_APP_GENRE_DOCUMENTARY || 'Documentary',
  FANTASY: process.env.REACT_APP_GENRE_FANTASY || 'Fantasy',
  MYSTERY: process.env.REACT_APP_GENRE_MYSTERY || 'Mystery',
  
  // Games
  RPG: process.env.REACT_APP_GENRE_RPG || 'RPG',
  STRATEGY: process.env.REACT_APP_GENRE_STRATEGY || 'Strategy',
  SPORTS: process.env.REACT_APP_GENRE_SPORTS || 'Sports',
  RACING: process.env.REACT_APP_GENRE_RACING || 'Racing',
  SIMULATION: process.env.REACT_APP_GENRE_SIMULATION || 'Simulation',
  PLATFORM: process.env.REACT_APP_GENRE_PLATFORM || 'Platform',
  PUZZLE: process.env.REACT_APP_GENRE_PUZZLE || 'Puzzle',
  FPS: process.env.REACT_APP_GENRE_FPS || 'FPS',
  MMORPG: process.env.REACT_APP_GENRE_MMORPG || 'MMORPG',
  
  // Books
  NOVEL: process.env.REACT_APP_GENRE_NOVEL || 'Novel',
  BIOGRAPHY: process.env.REACT_APP_GENRE_BIOGRAPHY || 'Biography',
  HISTORY: process.env.REACT_APP_GENRE_HISTORY || 'History',
  POETRY: process.env.REACT_APP_GENRE_POETRY || 'Poetry',
  PHILOSOPHY: process.env.REACT_APP_GENRE_PHILOSOPHY || 'Philosophy',
  SELF_HELP: process.env.REACT_APP_GENRE_SELF_HELP || 'Self-Help',
  DETECTIVE: process.env.REACT_APP_GENRE_DETECTIVE || 'Detective',
};

// Genre options array for dropdowns
export const GENRE_OPTIONS = {
  MOVIES: [
    GENRES.ACTION,
    GENRES.COMEDY,
    GENRES.DRAMA,
    GENRES.HORROR,
    GENRES.SCIFI,
    GENRES.ROMANCE,
    GENRES.THRILLER,
    GENRES.ANIMATION,
    GENRES.DOCUMENTARY,
    GENRES.FANTASY,
    GENRES.MYSTERY,
  ],
  GAMES: [
    GENRES.ACTION,
    GENRES.RPG,
    GENRES.STRATEGY,
    GENRES.SPORTS,
    GENRES.RACING,
    GENRES.SIMULATION,
    GENRES.PLATFORM,
    GENRES.PUZZLE,
    GENRES.FPS,
    GENRES.MMORPG,
  ],
  BOOKS: [
    GENRES.NOVEL,
    GENRES.SCIFI,
    GENRES.FANTASY,
    GENRES.DETECTIVE,
    GENRES.HISTORY,
    GENRES.BIOGRAPHY,
    GENRES.POETRY,
    GENRES.PHILOSOPHY,
    GENRES.SELF_HELP,
  ],
};

// Chart Messages
export const CHART_MESSAGES = {
  NO_DATA: process.env.REACT_APP_CHART_NO_DATA || 'No data yet',
};

// Validation Messages
export const VALIDATION_MESSAGES = {
  TITLE_REQUIRED: process.env.REACT_APP_VALIDATION_TITLE_REQUIRED || 'Title is required',
  GENRE_REQUIRED: process.env.REACT_APP_VALIDATION_GENRE_REQUIRED || 'Genre must be selected',
  STATUS_REQUIRED: process.env.REACT_APP_VALIDATION_STATUS_REQUIRED || 'Status must be selected',
  RATING_INVALID: process.env.REACT_APP_VALIDATION_RATING_INVALID || 'Enter a valid rating (1-10)',
  YEAR_INVALID: process.env.REACT_APP_VALIDATION_YEAR_INVALID || 'Enter a valid year',
};

// Main Menu
export const MAIN_MENU = {
  TITLE: process.env.REACT_APP_MAIN_MENU_TITLE || 'Collectify',
  SUBTITLE: process.env.REACT_APP_MAIN_MENU_SUBTITLE || 'Explore your movie, game, and book collection',
  RECENT_ADDED: process.env.REACT_APP_RECENT_ADDED || 'Recently Added',
  VIEW_ALL: process.env.REACT_APP_VIEW_ALL || 'View All',
  NO_RECENT_ITEMS: process.env.REACT_APP_NO_RECENT_ITEMS || 'No content added yet',
  EXPLORE_CATEGORIES: process.env.REACT_APP_EXPLORE_CATEGORIES || 'Explore Categories',
  NO_ITEMS: process.env.REACT_APP_NO_ITEMS || 'No content added yet',
};
