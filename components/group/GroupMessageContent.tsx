/* eslint-disable @next/next/no-img-element */
import { BackspaceIcon, PaperAirplaneIcon, DotsVerticalIcon } from "@heroicons/react/solid";
import Image from "next/image";
import { useEffect, useState } from "react";
import { auth, database } from "../../firebase";
import { onValue, ref, push, set, child } from "firebase/database";
import ScrollableFeed from "react-scrollable-feed";
import GroupType from "./GroupType";
import GroupMessageItem from "./GroupMessageItem";
import GroupOptionsPopup from "./options_popup/GroupOptionsPopup";
import AddUserGroupPopup from "./options_popup/AddUserGroupPopup";
import RemoveUserGroupPopup from "./options_popup/RemoveUserGroupPopup";
import { Timestamp } from "firebase/firestore";

type GroupMessageContentType = {
  group: GroupType
  windowMobile: boolean;
  onBackClick: () => void;
};

type GroupMessageType = {
  id: string;
  uid: string;
  groupId: string;
  text: string;
};

const GroupMessageContent: React.FC<GroupMessageContentType> = ({
  group,
  windowMobile,
  onBackClick,
}) => {
  const [textMessage, setTextMessage] = useState("");

  const [canSendMessage, setCanSendMessage] = useState(true)
  const [lastMessageTime, setLastMessageTime] = useState<number>(-1)
  const [sendMessageInterval, setSendMessageInterval] = useState<number>(-1)

  const [messages, setMessages] = useState<GroupMessageType[]>([]);

  const [optionsPopupVisible, setOptionsPopupVisible] = useState<boolean>(false);
  const [addUserPopupVisible, setAddUserPopupVisible] = useState<boolean>(false)
  const [removeUserPopupVisible, setRemoveUserPopupVisible] = useState<boolean>(false)

  const localUserUid = auth.currentUser?.uid

  useEffect(() => {
    const messagesRef = ref(database, `group/${group.id}/messages`);

    onValue(messagesRef, (snapshot) => {
      const newMessages: GroupMessageType[] = [];

      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        const message: GroupMessageType = {
          id: childData.id,
          uid: childData.uid,
          groupId: childData.groupId,
          text: childData.text,
        };
        newMessages.push(message);
      });

      setMessages(newMessages);
    });
  }, [group.id]);

  const delay = (delay: number) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(2)
      }, delay);
    })
  }

  console.log(sendMessageInterval)

  const sendMessage = async () => {
    if (!localUserUid) return
    setCanSendMessage(false)

    const messageRef = push(
      child(ref(database), `group/${group.id}/messages`)
    );

    const message: GroupMessageType = {
      id: messageRef.key || "",
      uid: localUserUid,
      groupId: group.id,
      text: textMessage,
    };

    set(messageRef, message);

    setTextMessage("");

    setSendMessageInterval(3)
    await delay(1000)
    setSendMessageInterval(2)
    await delay(1000)
    setSendMessageInterval(1)
    await delay(1000)

    setCanSendMessage(true)
  }

  return (
    <div
      className={`w-full h-full bg-white flex flex-col ${
        windowMobile ? "dark:bg-gray-900" : "dark:bg-gray-800 rounded-2xl"
      }`}
    >
      {optionsPopupVisible && (
        <GroupOptionsPopup 
          onAddUserClick={() => {
            setAddUserPopupVisible(true)
            setRemoveUserPopupVisible(false)
            setOptionsPopupVisible(false)
          }}
          onDeleteUserClick={() => {
            setAddUserPopupVisible(false)
            setRemoveUserPopupVisible(true)
            setOptionsPopupVisible(false)
          }}/>
      )}
      {addUserPopupVisible && <AddUserGroupPopup groupId={group.id} onUserAdded={() => setAddUserPopupVisible(false)}/>}
      {removeUserPopupVisible && <RemoveUserGroupPopup groupId={group.id} onUserRemoved={() => setRemoveUserPopupVisible(false)}/>}
      <div
        className={`w-full flex bg-gray-100 dark:bg-gray-800 border-b-2 border-gray-200 dark:border-gray-700 ${
          windowMobile ? "rounded-none" : "rounded-t-2xl"
        } items-center space-x-2 p-2`}
      >
        {windowMobile && (
          <div
            onClick={() => onBackClick()}
            className="rounded-full cursor-pointer w-10 h-10 p-2 hover:bg-gray-300 dark:hover:bg-gray-700 text-dark dark:text-white"
          >
            <BackspaceIcon />
          </div>
        )}
        <img
            className="rounded-full h-10 w-10"
            src={group.groupImage}
            alt={group.groupName}
          />
        <p className="text-dark dark:text-white text-lg grow">{group.groupName}</p>
        <div 
            onClick={() => {
              setAddUserPopupVisible(false)
              setRemoveUserPopupVisible(false)
              setOptionsPopupVisible(!optionsPopupVisible)
            }}
            className="w-8 h-8 rounded-full cursor-pointer text-gray-500 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-700 p-1">
            <DotsVerticalIcon/>
          </div>
      </div>
      <ScrollableFeed className="w-full space-y-3 p-4 grow scrollbar-hide">
        {messages.map((message, index) => (
          <GroupMessageItem
            key={message.id}
            text={message.text}
            uid={message.uid}
            byLocalUser={message.uid === localUserUid}
            hasMessageAbove={messages.at(index - 1)?.uid === message.uid}
            hasMessageBelow={messages.at(index + 1)?.uid === message.uid}
          />
        ))}
      </ScrollableFeed>
      {!canSendMessage && (
        <p className="ml-4 text-black dark:text-white">
          Wait {sendMessageInterval} seconds
        </p>
      )}
      <div className="flex items-center m-2 space-x-2 mb-12 lg:mb-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (textMessage.length > 0 && textMessage.length < 512 && canSendMessage) sendMessage()
          }}
          className="rounded-2xl bg-gray-300 dark:bg-gray-700 flex-grow"
        >
          <input
            className="bg-transparent p-2 border-0 outline-none text-dark dark:text-white text-lg w-full"
            type="text"
            value={textMessage}
            maxLength={512}
            placeholder={`Message to ${group.groupName}`}
            onChange={(e) => setTextMessage(e.target.value)}
          />
        </form>
        {(textMessage.length > 0 && textMessage.length < 512 && canSendMessage) && (
          <div
            onClick={() => sendMessage()}
            className="w-11 h-11 p-2 rounded-2xl bg-gray-300 dark:bg-gray-700 cursor-pointer text-black dark:text-white"
          >
            <PaperAirplaneIcon />
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupMessageContent;