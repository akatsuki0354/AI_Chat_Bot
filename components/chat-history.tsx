import React from 'react'

function ChatHistory({ groups }: { groups: any }) {
    return (
        <div>
            {groups.map((group: any) => (
                <div key={group.title} className="mb-4">
                    <h2 className="px-4 py-2 text-sm font-semibold text-muted-foreground">
                        Chat History
                    </h2>
                    <div>
                        {group.chats.map((chat: any) => (
                            <a
                                key={chat.id}
                                href={chat.url}>
                                <div className='px-4 py-2 hover:bg-accent cursor-pointer rounded-md mb-1'>
                                    <h1 className='text-sm line-clamp-1'>
                                        {chat.title}
                                    </h1>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

            ))}
        </div>
    )
}

export default ChatHistory