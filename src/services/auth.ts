
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
  } from 'firebase/auth';
  
  import {
    doc,
    setDoc,
    serverTimestamp,
  } from 'firebase/firestore';
  
  import { auth, db } from './firebase';
  
  // Criar uma nova conta
  export async function registerUser(
    name: string,
    email: string,
    password: string
  ) {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );
  
    // Salvar o nome no perfil de autenticação
    await updateProfile(credential.user, {
      displayName: name.trim(),
    });
  
    // Salvar os dados básicos no Firestore
    await setDoc(doc(db, 'users', credential.user.uid), {
      name: name.trim(),
      email: email.trim(),
      createdAt: serverTimestamp(),
    });
  
    return credential.user;
  }
  
  // Entrar em uma conta existente
  export async function loginUser(
    email: string,
    password: string
  ) {
    const credential = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );
  
    return credential.user;
  }
  
  // Sair da conta
  export async function logoutUser() {
    await signOut(auth);
  }
  