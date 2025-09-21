export interface Endpoint {
  method: string;
  url: string;
  description?: string;
  group: string;
  parameters?: Parameter[];
}

export interface Parameter {
  name: string;
  in: 'query' | 'path' | 'body';
  required?: boolean;
  type: string;
  description?: string;
  example?: any;
}

export const sampleEndpoints: Endpoint[] = [
  // Users Group
  {
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/users',
    description: 'Get all users',
    group: 'Users',
  },
  {
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/users/{id}',
    description: 'Get a user by ID',
    group: 'Users',
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        type: 'integer',
        description: 'User ID',
        example: 1,
      },
    ],
  },
  {
    method: 'POST',
    url: 'https://jsonplaceholder.typicode.com/users',
    description: 'Create a new user',
    group: 'Users',
    parameters: [
      {
        name: 'body',
        in: 'body',
        required: true,
        type: 'object',
        description: 'User data',
        example: {
          name: 'John Doe',
          email: 'john@example.com',
          username: 'johndoe',
        },
      },
    ],
  },

  // Posts Group
  {
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/posts',
    description: 'Get all posts',
    group: 'Posts',
  },
  {
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/posts/{id}',
    description: 'Get a post by ID',
    group: 'Posts',
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        type: 'integer',
        description: 'Post ID',
        example: 1,
      },
    ],
  },
  {
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/posts/{id}/comments',
    description: 'Get comments for a post',
    group: 'Posts',
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        type: 'integer',
        description: 'Post ID',
        example: 1,
      },
    ],
  },
  {
    method: 'POST',
    url: 'https://jsonplaceholder.typicode.com/posts',
    description: 'Create a new post',
    group: 'Posts',
    parameters: [
      {
        name: 'body',
        in: 'body',
        required: true,
        type: 'object',
        description: 'Post data',
        example: {
          title: 'New Post',
          body: 'Post content',
          userId: 1,
        },
      },
    ],
  },
  {
    method: 'PUT',
    url: 'https://jsonplaceholder.typicode.com/posts/{id}',
    description: 'Update a post',
    group: 'Posts',
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        type: 'integer',
        description: 'Post ID',
        example: 1,
      },
      {
        name: 'body',
        in: 'body',
        required: true,
        type: 'object',
        description: 'Updated post data',
        example: {
          title: 'Updated Post',
          body: 'Updated content',
          userId: 1,
        },
      },
    ],
  },
  {
    method: 'DELETE',
    url: 'https://jsonplaceholder.typicode.com/posts/{id}',
    description: 'Delete a post',
    group: 'Posts',
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        type: 'integer',
        description: 'Post ID',
        example: 1,
      },
    ],
  },

  // HTTPBin Group (for testing)
  {
    method: 'GET',
    url: 'https://httpbin.org/get',
    description: 'Test GET request',
    group: 'HTTPBin',
  },
  {
    method: 'GET',
    url: 'https://httpbin.org/get?param={value}',
    description: 'Test GET with query parameter',
    group: 'HTTPBin',
    parameters: [
      {
        name: 'value',
        in: 'query',
        required: false,
        type: 'string',
        description: 'Query parameter value',
        example: 'test',
      },
    ],
  },
  {
    method: 'POST',
    url: 'https://httpbin.org/post',
    description: 'Test POST request',
    group: 'HTTPBin',
    parameters: [
      {
        name: 'body',
        in: 'body',
        required: false,
        type: 'object',
        description: 'Request body',
        example: { key: 'value' },
      },
    ],
  },
  {
    method: 'PUT',
    url: 'https://httpbin.org/put',
    description: 'Test PUT request',
    group: 'HTTPBin',
    parameters: [
      {
        name: 'body',
        in: 'body',
        required: false,
        type: 'object',
        description: 'Request body',
        example: { key: 'updated value' },
      },
    ],
  },
  {
    method: 'DELETE',
    url: 'https://httpbin.org/delete',
    description: 'Test DELETE request',
    group: 'HTTPBin',
  },
  {
    method: 'GET',
    url: 'https://httpbin.org/html',
    description: 'Test HTML response',
    group: 'HTTPBin',
  },
  {
    method: 'GET',
    url: 'https://httpbin.org/status/404',
    description: 'Test 404 error (HTML response)',
    group: 'HTTPBin',
  },
];

export const sampleSwagger = {
  openapi: '3.0.0',
  info: {
    title: 'Sample API',
    version: '1.0.0',
  },
  paths: {
    '/users': {
      get: {
        summary: 'Get all users',
        tags: ['Users'],
      },
      post: {
        summary: 'Create a new user',
        tags: ['Users'],
      },
    },
    '/users/{id}': {
      get: {
        summary: 'Get a user by ID',
        tags: ['Users'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
      },
    },
    '/posts': {
      get: {
        summary: 'Get all posts',
        tags: ['Posts'],
      },
      post: {
        summary: 'Create a new post',
        tags: ['Posts'],
      },
    },
    '/posts/{id}': {
      get: {
        summary: 'Get a post by ID',
        tags: ['Posts'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
      },
      put: {
        summary: 'Update a post',
        tags: ['Posts'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
      },
      delete: {
        summary: 'Delete a post',
        tags: ['Posts'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
      },
    },
    '/posts/{id}/comments': {
      get: {
        summary: 'Get comments for a post',
        tags: ['Posts'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
      },
    },
    '/get': {
      get: {
        summary: 'Test GET request',
        tags: ['HTTPBin'],
      },
    },
    '/post': {
      post: {
        summary: 'Test POST request',
        tags: ['HTTPBin'],
      },
    },
    '/put': {
      put: {
        summary: 'Test PUT request',
        tags: ['HTTPBin'],
      },
    },
    '/delete': {
      delete: {
        summary: 'Test DELETE request',
        tags: ['HTTPBin'],
      },
    },
    '/html': {
      get: {
        summary: 'Test HTML response',
        tags: ['HTTPBin'],
      },
    },
    '/status/404': {
      get: {
        summary: 'Test 404 error (HTML response)',
        tags: ['HTTPBin'],
      },
    },
  },
};