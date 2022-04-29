import React,{useReducer, useEffect, useContext} from 'react';
import reducer from './reducer'
import {SET_LOADING,SET_STORIES,REMOVE_STORY,HANDLE_PAGE,HANDLE_SEARCH} from './actions';

const API_ENDPOINT ='http://hn.algolia.com/api/v1/search?';

const initialState = {
    isLoading : true,
    hits : [],
    query : 'react',
    page : 0,
    nbPages : 0,
}

const AppContext = React.createContext();


const AppProvider = ({children}) => {

    const [state,dispatch] = useReducer(reducer,initialState);

    const handlePage =  (value) => {
        dispatch({type : HANDLE_PAGE,payload : value})

    }

    const handleSearch = (query) => {
            dispatch({type : HANDLE_SEARCH, payload : query})
        }


    const removeStory = (id) => {
        dispatch({type : REMOVE_STORY, payload : id})
    }
    
    const fetchStories = async (url) => {

       

        dispatch({type : SET_LOADING});
        try{
            const response = await fetch(url);
            const data = await  response.json();
            dispatch({type : SET_STORIES,payload : {hits : data.hits, nbPages : data.nbPages}})


        }catch(error){
            console.log(error)
        }

    }

    useEffect(() => {
        fetchStories(`${API_ENDPOINT}query=${state.query}&page=${state.page}`)
    },[state.query,state.page])


    return <AppContext.Provider value={{...state,removeStory,handleSearch,handlePage}}>{children}</AppContext.Provider>
}

export const useGlobalContext = () => {
    return useContext(AppContext)
}

export {AppProvider,AppContext};