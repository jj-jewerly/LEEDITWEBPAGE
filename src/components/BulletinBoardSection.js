// src/components/BulletinBoardSection.js
import React, { useState, useEffect } from 'react';
import { db, serverTimestamp } from '../firebaseConfig';
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

function BulletinBoardSection() {
    const [posts, setPosts] = useState([]);
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [userIP, setUserIP] = useState('');

    useEffect(() => {
        // Fetch user IP address
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => setUserIP(data.ip))
            .catch(() => setUserIP('Unknown'));

        // Fetch posts in real-time
        const unsubscribe = onSnapshot(collection(db, 'posts'), (snapshot) => {
            const postsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPosts(postsData);
        });

        return () => unsubscribe();
    }, []);

    const handleAddPost = async (e) => {
        e.preventDefault();
        const hashedPassword = bcrypt.hashSync(password, 10);

        await addDoc(collection(db, 'posts'), {
            nickname,
            password: hashedPassword,
            title,
            content,
            date: serverTimestamp(),
            ip: userIP
        });

        setNickname('');
        setPassword('');
        setTitle('');
        setContent('');
        alert('Post added successfully!');
    };

    const handleDeletePost = async (postId) => {
        const userPassword = prompt('Please enter your password to delete this post:');
        const docRef = doc(db, 'posts', postId);
        const post = await getDoc(docRef);

        if (post.exists() && bcrypt.compareSync(userPassword, post.data().password)) {
            await deleteDoc(docRef);
            alert('Post deleted successfully!');
        } else {
            alert('Incorrect password.');
        }
    };

    return (
        <section className="bulletin-board container py-5" data-aos="fade-up">
            <h2 className="text-center mb-5">Bulletin Board</h2>
            <form onSubmit={handleAddPost}>
                <input type="text" placeholder="Nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} required></textarea>
                <button type="submit">Submit</button>
            </form>

            <table className="table table-striped mt-4">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Title</th>
                        <th>Nickname</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map((post, index) => (
                        <tr key={post.id}>
                            <td>{index + 1}</td>
                            <td>{post.title}</td>
                            <td>{post.nickname}</td>
                            <td>{post.date ? post.date.toDate().toLocaleString() : 'Pending'}</td>
                            <td>
                                <button onClick={() => handleDeletePost(post.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}

export default BulletinBoardSection;
