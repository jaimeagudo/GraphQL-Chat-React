import React from "react";
import gql from "graphql-tag";
import { get } from "lodash";
import update from "immutability-helper";
import { compose, mapProps, lifecycle } from "recompose";
import { graphql } from "react-apollo";
import MessageBox from "./MessageBox";

const chatroom = gql`
  query chatRoom($id: ID!) {
    Chat(id: $id) {
      messages {
        id
        text
      }
    }
  }
`;

const messageAdded = gql`
  subscription onMessageAdded($chatroomId: ID!) {
    OnMessageCreated(chatId: $chatroomId) {
      createdAt
      id
      text
      createdBy {
        displayName
        id
      }
    }
  }
`;
// const MessageAdded = gql`
//   subscription onMessageAdded($chatId: String!) {
//     MessageAdded(chatId: "17592186045473") {
//       id
//       text
//     }
//   }
// `;

function ChatMessages({ closeMessages, ready, title, id, messages }) {
  return (
    <section>
      <h1 className="title">{title}</h1>
      {ready
        ? messages.map(message => {
            return (
              <div key={message.id} className="message">
                <p>{message.text}</p>
              </div>
            );
          })
        : null}
      <MessageBox id={id} closeMessages={closeMessages} />
    </section>
  );
}

export default compose(
  graphql(chatroom, {
    options: ({ id }) => {
      return {
        variables: {
          id
        }
      };
    }
  }),
  mapProps(({ data, id, ...rest }) => {
    const subscribeToMore = data && data.subscribeToMore;
    const messages = (data && data.Chat && data.Chat.messages) || [];
    return {
      id,
      ready: !data.loading,
      messages,
      subscribeToMessages: (): void => {
        return subscribeToMore({
          document: messageAdded,
          variables: {
            chatroomId: id
          },
          onError: (e: Object): void => {
            return console.error("APOLLO-CHAT", e);
          },
          updateQuery: (
            previousResult: Object,
            { subscriptionData }: Object
          ): Object => {
            if (!subscriptionData.data) {
              return previousResult;
            }

            const messageToAdd = get(subscriptionData, "data.OnMessageCreated");

            const newResult = update(previousResult, {
              Chat: {
                messages: {
                  $push: [messageToAdd]
                }
              }
            });
            return newResult;
          }
        });
      },
      ...rest
    };
  }),
  lifecycle({
    componentWillMount() {
      const { subscribeToMessages } = this.props;
      return subscribeToMessages();
    }
  })
)(ChatMessages);
