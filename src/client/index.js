import ApolloClient, { createNetworkInterface } from "apollo-client";
import {
  SubscriptionClient,
  addGraphQLSubscriptions
} from "subscriptions-transport-ws";

// const wsClient = new SubscriptionClient('ws://localhost:4010/subscriptions');
const wsClient = new SubscriptionClient("ws://localhost:8888/graphql-ws");
const uri = "http://localhost:8888/graphql";
const baseNetworkInterface = createNetworkInterface({
  uri
  //  uri: '/graphql',
});

const subscriptionNetworkInterface = addGraphQLSubscriptions(
  baseNetworkInterface,
  wsClient
);

export default new ApolloClient({
  networkInterface: subscriptionNetworkInterface,
  connectToDevTools: true
});
