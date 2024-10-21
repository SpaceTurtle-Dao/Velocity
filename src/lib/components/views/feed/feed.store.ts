import type { Post } from '$lib/models/Meme';
import { writable } from 'svelte/store';

interface HomeScreenState {
       posts: Post[];
       loading: LoadingState;
       error: string | null;
}

enum LoadingState {
       Idle = 'IDLE',
       Loading = 'LOADING',
       Loaded = 'LOADED',
       Error = 'ERROR'
}

const initialState: HomeScreenState = {
       posts: [],
       loading: LoadingState.Idle,
       error: null,
};

export const homeScreenState = writable<HomeScreenState>(initialState);

export const loadPosts = async () => {
       homeScreenState.update(state => ({ ...state, loading: LoadingState.Loading, error: null }));

       try {
              // Replace with your actual API call
              const response = await fetch('/api/posts');
              const posts: Post[] = await response.json();

              homeScreenState.update(state => ({ ...state, posts, loading: LoadingState.Loaded }));
       } catch (error: any) {
              homeScreenState.update(state => ({ ...state, loading: LoadingState.Error, error: error.message || String(error) }));
       }
};

export const addPost = (post: Post) => {
       homeScreenState.update(state => ({ ...state, posts: [post, ...state.posts] }));
};
