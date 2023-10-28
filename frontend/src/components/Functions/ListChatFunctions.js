export function getSender(loggedUser, chat) {
  if (chat.isGroupChat) {
    return chat;
  } 
    
  if (chat.users[1]._id === loggedUser._id) {
    return chat.users[0];
  } 
  return chat.users[1];
}
export async function setPreviousSelected(chat, index, setActiveChat, setLastSelected) {
  setActiveChat(chat);
  setLastSelected(chat);
  sessionStorage.setItem("previousSelected", JSON.stringify(chat));
}