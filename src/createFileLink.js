import { ApolloLink, Observable } from 'apollo-link';
import { parseAndCheckHttpResponse } from 'apollo-link-http-common';
import { print } from 'graphql/language/printer';
import { has } from 'lodash';

// default HTTPoptions to includeQuery and extensions
const defaultHttpOptions = {
  includeQuery: true,
  includeExtensions: false,
};

export default ({ uri = '/graphql', includeExtensions, ...requestOptions } = {}) => {
  const fetcher = fetch;

  return new ApolloLink(operation =>
    // create a new Observable
    new Observable((observer) => {
      // get the headers, credentials, uri, option etc from the operations context
      const {
        headers,
        credentials,
        fetchOptions = {},
        uri: contextURI,
        http: httpOptions = {},
      } = operation.getContext();

      // get the operationName, extensions, variable, query from the operation.
      const {
        operationName, extensions, variables, query,
      } = operation;

      // set HTTP equal to the spread of default HttpOptions + httpOptions from the
      // operations context.
      const http = { ...defaultHttpOptions, ...httpOptions };
      // the body variables is an object with the operationName and variables.
      const body = { operationName, variables };

      // if the includeExtensinos option is true, set body.extensions = extensions that
      // we got from the operation.
      if (includeExtensions || http.includeExtensions) body.extensions = extensions;
      // also, if the http includeQuery options is true, set the body.query to the query
      if (http.includeQuery) body.query = print(query);

      let serializedBody;

      try {
        // stringify the body.
        serializedBody = JSON.stringify(body);
      } catch (e) {
        // incase of errors, throw an error saying payload is not serializable.
        const parseError = new Error(`Network request failed. Payload is not serializable: ${e.message}`);
        parseError.parseError = e;
        throw parseError;
      }

      // for the headers, set it to accept any kind of request.
      const myHeaders = {
        accept: '*/*',
      };

      // if the variables in the operations has the word file, then create new FormData for the
      // serializedBody and append operations key with the stringBody (serializedBody) to it.
      // also append the file key with the variables.file as value.
      if (has(variables, 'file')) {
        const stringBody = serializedBody;
        serializedBody = new FormData();
        serializedBody.append('operations', stringBody);
        serializedBody.append('file', variables.file);
      } else {
        // otherwise, jsut set myHeader content-type key to application/json.
        myHeaders['content-type'] = 'application/json';
      }

      // set options to fetchOptions we received from operations context.
      let options = fetchOptions;
      // if the requestOptions contains fetchOptions then spread them into options as well.
      if (requestOptions.fetchOptions) options = { ...requestOptions.fetchOptions, ...options };

      // the fetcherOptions will contain method: POST, the options spread out, the headers are
      // hyHeaders that we declared above and the body will be the serializedBody.
      const fetcherOptions = {
        method: 'POST',
        ...options,
        headers: myHeaders,
        body: serializedBody,
      };

      // requestOptions contains credentials or the operation contains credentials, attach them
      // to the fetcherOptions.
      if (requestOptions.credentials) fetcherOptions.credentials = requestOptions.credentials;
      if (credentials) fetcherOptions.credentials = credentials;

      // if the requestOptions or operation contains header, spread the new headers into the
      // existing fetcherOptions headers.
      if (requestOptions.headers) {
        fetcherOptions.headers = {
          ...fetcherOptions.headers,
          ...requestOptions.headers,
        };
      }
      if (headers) fetcherOptions.headers = { ...fetcherOptions.headers, ...headers };

      // pass the uri and fetcherOptions to fetch function. Then set the operation context to
      // the response received. once this is done, parseAndCheckHTTPResponse to make sure that
      // the opration we created is valid. Then, pass the result in observer.next and complete.
      fetcher(contextURI || uri, fetcherOptions)
      // attach the raw response to the context for usage
        .then((response) => {
          operation.setContext({ response });
          return response;
        })
        .then(parseAndCheckHttpResponse(operation))
        .then((result) => {
          // we have data and can send it to back up the link chain
          observer.next(result);
          observer.complete();
          return result;
        })
        .catch((err) => {
          // fetch was cancelled so its already been cleaned up in the unsubscribe
          if (err.name === 'AbortError') return;
          observer.error(err);
        });

      return () => {};
    }));
};
