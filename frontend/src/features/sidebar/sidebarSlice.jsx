import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  topLinks: [
    { href: '#chat', title: 'Chat', label: 'Chat', selected: 'true' },
    { href: '#groupChat', title: 'Group Chat', label: 'GroupChat', selected: 'false' },
    { href: '#bots', title: 'Bots', label: 'Bots', selected: 'false' },
  ],
  
  bottomLinks: [
    { href: '#mode', title: 'Mode', label: 'Mode', selected: 'false' },
    { href: '#logout', title: 'Logout', label: 'Logout', selected: 'false' },
  ],
}

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    selectThisLink: (state, action) => {
      const { title } = action.payload;
      
      const updatedTopLinks = state.topLinks.map((link) => ({
        ...link,
        selected: link.title === title,
      }));

      const updatedBottomLinks = state.bottomLinks.map((link) => ({
        ...link,
        selected: link.title === title,
      }));
      
      state.topLinks = updatedTopLinks;
      console.log(state.topLinks);
      state.bottomLinks = updatedBottomLinks;
    }
  }
})

export const { selectThisLink } = sidebarSlice.actions;

export default sidebarSlice.reducer;