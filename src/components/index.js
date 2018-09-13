import React from "react";
import gql from "graphql-tag";
import { compose, mapProps } from "recompose";
import { graphql } from "react-apollo";
import ChatroomRow from "./Row";

const chatrooms = gql`
  query Chatrooms {
    Chats {
      id
      title
    }
  }
`;

function Chatroom({ chatrooms = [] }) {
  //17592186045473
  // <ChatroomRow
  //   key={"17592186045473"}
  //   title={"test"}
  //   id={"17592186045473"}
  // />;

  return (
    <section>
      <h1 className="title">Chatrooms</h1>

      {chatrooms.map(room => {
        return <ChatroomRow key={room.id} title={room.title} id={room.id} />;
      })}
    </section>
  );
}

export default compose(
  graphql(chatrooms),
  mapProps(({ data, ...rest }) => {
    const chatrooms = (data && data.Chats) || [];
    return {
      chatrooms,
      ...rest
    };
  })
)(Chatroom);
