import React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { moviesAPI, gamesAPI, booksAPI } from '../services/api';

const ProjectContext = createContext();

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}

export function ProjectProvider({ children }) {
  const [movies, setMovies] = useState([]);
  const [games, setGames] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  // API mapping
  const getAPI = (type) => {
    switch (type) {
      case 'series': return moviesAPI;
      case 'game': return gamesAPI;
      case 'book': return booksAPI;
      default: return moviesAPI;
    }
  };

  const getStateUpdater = (type) => {
    switch (type) {
      case 'series': return setMovies;
      case 'game': return setGames;
      case 'book': return setBooks;
      default: return setMovies;
    }
  };

  // Data fetching
  const fetchData = async (type) => {
    setLoading(true);
    try {
      const api = getAPI(type);
      const response = await api.getAll();
      const setter = getStateUpdater(type);
      setter(response.data);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Load all data on mount
  useEffect(() => {
    fetchData('series');
    fetchData('game');
    fetchData('book');
  }, []);

  // Proje ekleme fonksiyonu
  const addProject = async (project, type) => {
    setLoading(true);
    try {
      const api = getAPI(type);
      const response = await api.create(project);
      const setter = getStateUpdater(type);
      
      setter(prev => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      console.error(`Error adding ${type}:`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Proje güncelleme fonksiyonu
  const updateProject = async (id, updatedProject, type) => {
    setLoading(true);
    try {
      const api = getAPI(type);
      const response = await api.update(id, updatedProject);
      const setter = getStateUpdater(type);
      
      setter(prev => 
        prev.map(project => 
          project._id === id ? response.data : project
        )
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Proje silme fonksiyonu
  const deleteProject = async (id, type) => {
    try {
      const api = getAPI(type);
      await api.delete(id);
      const setter = getStateUpdater(type);
      
      setter(prev => prev.filter(project => project._id !== id));
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      throw error;
    }
  };

  // Türe göre proje alma
  const getProjectsByType = (type) => {
    switch (type) {
      case 'series': return movies;
      case 'game': return games;
      case 'book': return books;
      default: return movies;
    }
  };

  // Aynı isimde proje var mı kontrolü
  const isDuplicateTitle = (title, type) => {
    const projects = getProjectsByType(type);
    return projects.some(project => 
      project.title.toLowerCase().trim() === title.toLowerCase().trim()
    );
  };

  const value = {
    movies,
    games,
    books,
    loading,
    addProject,
    updateProject,
    deleteProject,
    getProjectsByType,
    fetchData,
    setLoading,
    isDuplicateTitle, // yeni fonksiyon eklendi
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}
