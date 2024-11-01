// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup,
    signOut,
    onAuthStateChanged 
} from 'firebase/auth';
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs,
    getDoc,
    setDoc, 
    doc, 
    deleteDoc, 
    updateDoc,
    onSnapshot, 
    query, 
    orderBy,
    where,
    serverTimestamp 
} from 'firebase/firestore';
import { 
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'firebase/storage';

// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyBbRlzkGs_JNzY3oisM2rQmtnQx0gRKWGU",
    authDomain: "leadit-52828.firebaseapp.com",
    projectId: "leadit-52828",
    storageBucket: "leadit-52828.appspot.com",
    messagingSenderId: "229049257517",
    appId: "1:229049257517:web:a0c003f6c97a4b1c98f2a4"
};

// 어드민 이메일 리스트
const ADMIN_EMAILS = ['gnt8521@gmail.com'];

// Firebase 초기화
let app;
let auth;
let db;
let storage;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
} catch (error) {
    if (!/already exists/.test(error.message)) {
        console.error('Firebase initialization error', error.stack);
    }
}

// Google 인증 설정
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

// Google 로그인
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // 사용자 정보를 Firestore에 저장
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            isAdmin: ADMIN_EMAILS.includes(user.email),
            lastLogin: serverTimestamp(),
            createdAt: serverTimestamp(),
            status: 'active'
        }, { merge: true });

        return user;
    } catch (error) {
        console.error('Error during Google sign in:', error);
        throw error;
    }
};

// 로그아웃
export const signOutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error during sign out:', error);
        throw error;
    }
};

// 어드민 체크
export const checkIsAdmin = async (user) => {
    if (!user) return false;
    
    try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
            return userSnap.data().isAdmin || false;
        }
        return false;
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
};

// 사용자 관리 함수들
export const userManagement = {
    // 모든 사용자 가져오기
    getAllUsers: async () => {
        const usersRef = collection(db, 'users');
        const snapshot = await getDocs(usersRef);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    },

    // 사용자 상태 업데이트
    updateUserStatus: async (userId, status) => {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            status: status,
            updatedAt: serverTimestamp()
        });
    },

    // 사용자 권한 업데이트
    updateUserRole: async (userId, isAdmin) => {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            isAdmin: isAdmin,
            updatedAt: serverTimestamp()
        });
    }
};

// 게시글 관리 함수들
export const postManagement = {
    // 게시글 업데이트
    updatePost: async (postId, updateData) => {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
            ...updateData,
            updatedAt: serverTimestamp()
        });
    },

    // 게시글 삭제 (이미지 포함)
    deletePost: async (postId) => {
        const postRef = doc(db, 'posts', postId);
        const post = await getDoc(postRef);
        
        if (post.exists() && post.data().imageUrl) {
            const imageRef = ref(storage, post.data().imageUrl);
            await deleteObject(imageRef);
        }
        
        await deleteDoc(postRef);
    },

    // 모든 게시글 가져오기
    getAllPosts: async () => {
        const postsQuery = query(
            collection(db, 'posts'),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(postsQuery);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }
};

export {
    auth,
    db,
    storage,
    serverTimestamp,
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    deleteDoc,
    updateDoc,
    onSnapshot,
    query,
    orderBy,
    where,
    ref,
    uploadBytes,
    getDownloadURL
};