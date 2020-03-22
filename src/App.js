import React from 'react';
import ApolloClient from 'apollo-boost';
import fetch from 'unfetch';
import { ApolloProvider } from 'react-apollo';
import { RegisterBed } from './components/RegisterBed';
import { Layout } from './components/Layout';

const client = new ApolloClient({
  uri: 'https://bed-tracking.gigalixirapp.com/api',
  fetch
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Layout>
        <RegisterBed />
      </Layout>
    </ApolloProvider>
  );
}

export default App;
