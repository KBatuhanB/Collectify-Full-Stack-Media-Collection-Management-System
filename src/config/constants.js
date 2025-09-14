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
  APP_TITLE: process.env.REACT_APP_APP_TITLE || 'Proje Koleksiyonu',
  LOADING: process.env.REACT_APP_LOADING_TEXT || 'Yükleniyor...',
  ERROR: process.env.REACT_APP_ERROR_TEXT || 'Bir hata oluştu',
  RETRY: process.env.REACT_APP_RETRY_TEXT || 'Tekrar Dene',
  SAVE: process.env.REACT_APP_SAVE_TEXT || 'Kaydet',
  CANCEL: process.env.REACT_APP_CANCEL_TEXT || 'İptal',
  DELETE: process.env.REACT_APP_DELETE_TEXT || 'Sil',
  EDIT: process.env.REACT_APP_EDIT_TEXT || 'Düzenle',
  ADD: process.env.REACT_APP_ADD_TEXT || 'Ekle',
  CLOSE: process.env.REACT_APP_CLOSE_TEXT || 'Kapat',

  // Form Labels
  TITLE: process.env.REACT_APP_TITLE_LABEL || 'Başlık',
  GENRE: process.env.REACT_APP_GENRE_LABEL || 'Tür',
  STATUS: process.env.REACT_APP_STATUS_LABEL || 'Durum',
  RATING: process.env.REACT_APP_RATING_LABEL || 'Puan',
  COMMENT: process.env.REACT_APP_COMMENT_LABEL || 'Yorum',
  YEAR: process.env.REACT_APP_YEAR_LABEL || 'Yıl',
  DIRECTOR: process.env.REACT_APP_DIRECTOR_LABEL || 'Yönetmen',
  AUTHOR: process.env.REACT_APP_AUTHOR_LABEL || 'Yazar',
  PLATFORM: process.env.REACT_APP_PLATFORM_LABEL || 'Platform',
  IMAGE: process.env.REACT_APP_IMAGE_LABEL || 'Resim',

  // Rating Section Label
  RATING_SECTION: process.env.REACT_APP_RATING_SECTION_LABEL || 'Puan',
};

// Status Options
export const STATUS_OPTIONS = {
  MOVIES: [
    { value: 'planned', label: process.env.REACT_APP_STATUS_PLANNED_SERIES || 'İzlenecek' },
    { value: 'watching', label: process.env.REACT_APP_STATUS_WATCHING || 'İzleniyor' },
    { value: 'completed', label: process.env.REACT_APP_STATUS_COMPLETED || 'İzlendi' },
    { value: 'dropped', label: process.env.REACT_APP_STATUS_DROPPED || 'Bırakıldı' },
  ],
  BOOKS: [
    { value: 'planned', label: process.env.REACT_APP_STATUS_PLANNED_BOOK || 'Okunacak' },
    { value: 'reading', label: process.env.REACT_APP_STATUS_READING || 'Okunuyor' },
    { value: 'completed', label: process.env.REACT_APP_STATUS_READ || 'Okundu' },
    { value: 'dropped', label: process.env.REACT_APP_STATUS_DROPPED || 'Bırakıldı' },
  ],
  GAMES: [
    { value: 'planned', label: process.env.REACT_APP_STATUS_PLANNED_GAME || 'Oynanacak' },
    { value: 'playing', label: process.env.REACT_APP_STATUS_PLAYING || 'Oynanıyor' },
    { value: 'completed', label: process.env.REACT_APP_STATUS_PLAYED || 'Oynandı' },
    { value: 'dropped', label: process.env.REACT_APP_STATUS_DROPPED || 'Bırakıldı' },
  ],
};

// Dashboard Titles
export const DASHBOARD_TITLES = {
  BOOKS: process.env.REACT_APP_BOOKS_DASHBOARD_TITLE || 'Kitap Koleksiyonu',
  MOVIES: process.env.REACT_APP_MOVIES_DASHBOARD_TITLE || 'Dizi/Film Koleksiyonu',
  GAMES: process.env.REACT_APP_GAMES_DASHBOARD_TITLE || 'Oyun Koleksiyonu',
};

// Modal Titles
export const MODAL_TITLES = {
  ADD_BOOK: process.env.REACT_APP_ADD_BOOK_MODAL_TITLE || 'Yeni Kitap Ekle',
  ADD_MOVIE: process.env.REACT_APP_ADD_MOVIE_MODAL_TITLE || 'Yeni Dizi/Film Ekle',
  ADD_GAME: process.env.REACT_APP_ADD_GAME_MODAL_TITLE || 'Yeni Oyun Ekle',
  EDIT_BOOK: process.env.REACT_APP_EDIT_BOOK_MODAL_TITLE || 'Kitap Düzenle',
  EDIT_MOVIE: process.env.REACT_APP_EDIT_MOVIE_MODAL_TITLE || 'Dizi/Film Düzenle',
  EDIT_GAME: process.env.REACT_APP_EDIT_GAME_MODAL_TITLE || 'Oyun Düzenle',
};

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: process.env.REACT_APP_ERROR_REQUIRED_FIELD || 'Bu alan zorunludur',
  GENRE_REQUIRED: process.env.REACT_APP_ERROR_GENRE_REQUIRED || 'Lütfen bir tür seçin!',
  DUPLICATE_TITLE: {
    MOVIE: process.env.REACT_APP_ERROR_DUPLICATE_TITLE_MOVIE || 'Bu isimde bir dizi/film zaten mevcut!',
    GAME: process.env.REACT_APP_ERROR_DUPLICATE_TITLE_GAME || 'Bu isimde bir oyun zaten mevcut!',
    BOOK: process.env.REACT_APP_ERROR_DUPLICATE_TITLE_BOOK || 'Bu isimde bir kitap zaten mevcut!',
  },
  FILE_UPLOAD: process.env.REACT_APP_ERROR_FILE_UPLOAD || 'Dosya yükleme hatası!',
  FILE_TOO_LARGE: process.env.REACT_APP_ERROR_FILE_TOO_LARGE || 'Dosya boyutu çok büyük. Maksimum 5MB yükleyebilirsiniz.',
  ADDING_PROJECT: process.env.REACT_APP_ERROR_ADDING_PROJECT || 'Proje eklenirken hata oluştu',
  UPDATING_PROJECT: process.env.REACT_APP_ERROR_UPDATING_PROJECT || 'Proje güncellenirken hata oluştu',
  DELETING_PROJECT: process.env.REACT_APP_ERROR_DELETING_PROJECT || 'Proje silinirken hata oluştu',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  PROJECT_ADDED: process.env.REACT_APP_SUCCESS_PROJECT_ADDED || 'Proje başarıyla eklendi',
  PROJECT_UPDATED: process.env.REACT_APP_SUCCESS_PROJECT_UPDATED || 'Proje başarıyla güncellendi',
  PROJECT_DELETED: process.env.REACT_APP_SUCCESS_PROJECT_DELETED || 'Proje başarıyla silindi',
};

// Empty State Messages
export const EMPTY_STATE_MESSAGES = {
  BOOKS: process.env.REACT_APP_EMPTY_BOOKS_MESSAGE || 'Henüz kitap eklemediniz',
  MOVIES: process.env.REACT_APP_EMPTY_MOVIES_MESSAGE || 'Henüz dizi/film eklemediniz',
  GAMES: process.env.REACT_APP_EMPTY_GAMES_MESSAGE || 'Henüz oyun eklemediniz',
  DESCRIPTION: process.env.REACT_APP_EMPTY_STATE_DESCRIPTION || 'Yeni bir proje eklemek için + butonuna tıklayın',
  NO_ITEMS: process.env.REACT_APP_NO_ITEMS || 'Henüz içerik eklenmemiş', // yeni eklendi
};

// Chart Titles
export const CHART_TITLES = {
  GENRE: process.env.REACT_APP_CHART_GENRE_TITLE || 'Türlere Göre Dağılım',
  STATUS: process.env.REACT_APP_CHART_STATUS_TITLE || 'Durumlara Göre Dağılım',
};

// Navigation
export const NAVIGATION = {
  BOOKS: process.env.REACT_APP_NAV_BOOKS || 'Kitaplar',
  MOVIES: process.env.REACT_APP_NAV_MOVIES || 'Dizi/Film',
  GAMES: process.env.REACT_APP_NAV_GAMES || 'Oyunlar',
  HOME: process.env.REACT_APP_NAV_HOME || 'Ana Sayfa',
};

// Image Upload
export const IMAGE_UPLOAD = {
  TEXT: process.env.REACT_APP_IMAGE_UPLOAD_TEXT || 'Resim Yükle',
  UPLOADING: process.env.REACT_APP_IMAGE_UPLOADING_TEXT || 'Yükleniyor...',
  DESC: process.env.REACT_APP_IMAGE_UPLOAD_DESC || 'JPG, PNG veya GIF formatında',
  NO_IMAGE: process.env.REACT_APP_NO_IMAGE_TEXT || 'Resim yüklenmedi',
};

// Delete Dialog
export const DELETE_DIALOG = {
  TITLE: {
    BOOK: process.env.REACT_APP_DELETE_DIALOG_TITLE_BOOK || 'Kitabı Sil',
    GAME: process.env.REACT_APP_DELETE_DIALOG_TITLE_GAME || 'Oyunu Sil',
    MOVIE: process.env.REACT_APP_DELETE_DIALOG_TITLE_MOVIE || 'Dizi/Filmi Sil',
  },
  CONTENT: {
    BOOK: process.env.REACT_APP_DELETE_DIALOG_CONTENT_BOOK || 'Bu kitabı silmek istediğinizden emin misiniz?',
    GAME: process.env.REACT_APP_DELETE_DIALOG_CONTENT_GAME || 'Bu oyunu silmek istediğinizden emin misiniz?',
    MOVIE: process.env.REACT_APP_DELETE_DIALOG_CONTENT_MOVIE || 'Bu dizi/filmi silmek istediğinizden emin misiniz?',
  },
  CANCEL: process.env.REACT_APP_DELETE_DIALOG_CANCEL || 'Vazgeç',
  CONFIRM: process.env.REACT_APP_DELETE_DIALOG_CONFIRM || 'Sil',
};

// Card Labels
export const CARD_LABELS = {
  GENRE: process.env.REACT_APP_CARD_GENRE || 'Tür:',
  AUTHOR: process.env.REACT_APP_CARD_AUTHOR || 'Yazar:',
  DIRECTOR: process.env.REACT_APP_CARD_DIRECTOR || 'Yönetmen:',
  PLATFORM: process.env.REACT_APP_CARD_PLATFORM || 'Platform:',
  DEVELOPER: process.env.REACT_APP_CARD_DEVELOPER || 'Geliştirici:',
  YEAR: process.env.REACT_APP_CARD_YEAR || 'Yıl:',
  COMMENT: process.env.REACT_APP_CARD_COMMENT || 'Yorum:',
  EDIT: process.env.REACT_APP_CARD_EDIT || 'Düzenle',
  DELETE: process.env.REACT_APP_CARD_DELETE || 'Sil',
};

// Genres
export const GENRES = {
  // Movies/Series
  ACTION: process.env.REACT_APP_GENRE_ACTION || 'Aksiyon',
  COMEDY: process.env.REACT_APP_GENRE_COMEDY || 'Komedi',
  DRAMA: process.env.REACT_APP_GENRE_DRAMA || 'Drama',
  HORROR: process.env.REACT_APP_GENRE_HORROR || 'Korku',
  SCIFI: process.env.REACT_APP_GENRE_SCIFI || 'Bilim Kurgu',
  ROMANCE: process.env.REACT_APP_GENRE_ROMANCE || 'Romantik',
  THRILLER: process.env.REACT_APP_GENRE_THRILLER || 'Gerilim',
  ANIMATION: process.env.REACT_APP_GENRE_ANIMATION || 'Animasyon',
  DOCUMENTARY: process.env.REACT_APP_GENRE_DOCUMENTARY || 'Belgesel',
  FANTASY: process.env.REACT_APP_GENRE_FANTASY || 'Fantastik',
  MYSTERY: process.env.REACT_APP_GENRE_MYSTERY || 'Gizem',
  
  // Games
  RPG: process.env.REACT_APP_GENRE_RPG || 'RPG',
  STRATEGY: process.env.REACT_APP_GENRE_STRATEGY || 'Strateji',
  SPORTS: process.env.REACT_APP_GENRE_SPORTS || 'Spor',
  RACING: process.env.REACT_APP_GENRE_RACING || 'Yarış',
  SIMULATION: process.env.REACT_APP_GENRE_SIMULATION || 'Simülasyon',
  PLATFORM: process.env.REACT_APP_GENRE_PLATFORM || 'Platform',
  PUZZLE: process.env.REACT_APP_GENRE_PUZZLE || 'Bulmaca',
  FPS: process.env.REACT_APP_GENRE_FPS || 'FPS',
  MMORPG: process.env.REACT_APP_GENRE_MMORPG || 'MMORPG',
  
  // Books
  NOVEL: process.env.REACT_APP_GENRE_NOVEL || 'Roman',
  BIOGRAPHY: process.env.REACT_APP_GENRE_BIOGRAPHY || 'Biyografi',
  HISTORY: process.env.REACT_APP_GENRE_HISTORY || 'Tarih',
  POETRY: process.env.REACT_APP_GENRE_POETRY || 'Şiir',
  PHILOSOPHY: process.env.REACT_APP_GENRE_PHILOSOPHY || 'Felsefe',
  SELF_HELP: process.env.REACT_APP_GENRE_SELF_HELP || 'Kişisel Gelişim',
  DETECTIVE: process.env.REACT_APP_GENRE_DETECTIVE || 'Polisiye',
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
  NO_DATA: process.env.REACT_APP_CHART_NO_DATA || 'Henüz veri yok',
};

// Validation Messages
export const VALIDATION_MESSAGES = {
  TITLE_REQUIRED: process.env.REACT_APP_VALIDATION_TITLE_REQUIRED || 'Başlık zorunludur',
  GENRE_REQUIRED: process.env.REACT_APP_VALIDATION_GENRE_REQUIRED || 'Tür seçilmelidir',
  STATUS_REQUIRED: process.env.REACT_APP_VALIDATION_STATUS_REQUIRED || 'Durum seçilmelidir',
  RATING_INVALID: process.env.REACT_APP_VALIDATION_RATING_INVALID || 'Geçerli bir puan giriniz (1-10)',
  YEAR_INVALID: process.env.REACT_APP_VALIDATION_YEAR_INVALID || 'Geçerli bir yıl giriniz',
};

// Main Menu
export const MAIN_MENU = {
  TITLE: process.env.REACT_APP_MAIN_MENU_TITLE || 'Collectify',
  SUBTITLE: process.env.REACT_APP_MAIN_MENU_SUBTITLE || 'Film, oyun ve kitap koleksiyonunuzu keşfedin',
  RECENT_ADDED: process.env.REACT_APP_RECENT_ADDED || 'Son Eklenenler',
  VIEW_ALL: process.env.REACT_APP_VIEW_ALL || 'Tümünü Gör',
  NO_RECENT_ITEMS: process.env.REACT_APP_NO_RECENT_ITEMS || 'Henüz hiç içerik eklenmemiş',
  EXPLORE_CATEGORIES: process.env.REACT_APP_EXPLORE_CATEGORIES || 'Kategorileri Keşfet',
  NO_ITEMS: process.env.REACT_APP_NO_ITEMS || 'Henüz içerik eklenmemiş', // yeni eklendi
};
