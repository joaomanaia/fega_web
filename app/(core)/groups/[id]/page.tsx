import MainContainer from "@/components/m3/MainContainer"
import MessageForm from "../../components/message/MessageForm"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/types/database.types"
import { cookies } from "next/headers"
import { GroupMessageWithUserType } from "@/types/group/GroupMessageType"
import GroupMessage from "./components/GroupMessage"

interface GroupMessagePageProps {
  params: {
    id: string
  }
}

const getLocalUserUid = async (): Promise<string | null> => {
  const supabase = createServerComponentClient<Database>({ cookies })

  const { data: { user } } = await supabase.auth.getUser()

  return user?.id ?? null
}

const getMessages = async (groupId: string): Promise<GroupMessageWithUserType[]> => {
  const supabase = createServerComponentClient<Database>({ cookies })

  const { data: groupMessages } = await supabase
    .from("group_messages")
    .select("*, user:users(*)")
    .match({ group_id: groupId })
    .order("created_at")

  return groupMessages as GroupMessageWithUserType[]
}

export default async function GroupMessagePage({ params }: GroupMessagePageProps) {
  const localUserUid = await getLocalUserUid()

  if (!localUserUid) return <div>Sign in to message in groups</div>

  const messages = await getMessages(params.id)

  return (
    <MainContainer className="w-full h-auto flex flex-col items-center xl:h-auto xl:w-4/6">
      <div className="w-full space-y-3 p-4 flex-grow overflow-y-scroll">
        {messages.map((message, index) => (
          <GroupMessage
            key={message.id}
            message={message.message}
            user={message.user}
            byLocalUser={message.uid === localUserUid}
            hasMessageAbove={messages.at(index - 1)?.uid === message.uid}
            hasMessageBelow={messages.at(index + 1)?.uid === message.uid}
          />
        ))}
      </div>
      <MessageForm messageTo="Teste" />
    </MainContainer>
  )
}
