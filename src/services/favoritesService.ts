import { 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  collection 
} from 'firebase/firestore';
import { db } from './firebase'; // Usa a configuração do Firebase existente no projeto
import { Movie } from '../types/movie';

export async function addFavoriteMovie(userId: string, movie: Movie) {
  try {
    const movieRef = doc(db, `users/${userId}/favorites`, String(movie.id));
    await setDoc(movieRef, movie);
  } catch (error) {
    console.error('Erro ao adicionar favorito no Firebase:', error);
    throw error;
  }
}

export async function removeFavoriteMovie(userId: string, movieId: number) {
  try {
    const movieRef = doc(db, `users/${userId}/favorites`, String(movieId));
    await deleteDoc(movieRef);
  } catch (error) {
    console.error('Erro ao remover favorito do Firebase:', error);
    throw error;
  }
}

export async function getFavoriteMovies(userId: string): Promise<Movie[]> {
  try {
    const favoritesRef = collection(db, `users/${userId}/favorites`);
    const snapshot = await getDocs(favoritesRef);
    
    const movies: Movie[] = [];
    snapshot.forEach((doc) => {
      movies.push(doc.data() as Movie);
    });
    
    return movies;
  } catch (error) {
    console.error('Erro ao buscar favoritos do Firebase:', error);
    return [];
  }
}