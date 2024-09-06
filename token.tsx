export const token = {
    refresh:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyNDUxNjA1NSwiaWF0IjoxNzI0NDI5NjU1LCJqdGkiOiI5ZmRhYWU2MWQ4MDY0YThjOGE3ZDY0ZjY3NTIxZjUzNyIsInVzZXJfaWQiOjEsInNlc3Npb24iOiJhZG1pbiIsIm5hbWUiOiIiLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInN0YWNraG9sZGVyX3RpdGxlIjoidGVzdGUiLCJyb2xlX2lkIjoxLCJyb2xlX3RpdGxlIjoidGVzdGUifQ.7MR81RPda4KQN3kIM70L7ZvC-I4GV43kKjdNFjzasFo",
    access: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI1MzgzMDgzLCJpYXQiOjE3MjUzNzU0NTgsImp0aSI6IjcyYWRkMDUzM2MzYzRhNGNhYzIzM2IxN2I2Mjk5ZGRiIiwidXNlcl9pZCI6MTA0MjIsInNlc3Npb24iOiJhZG1pbiIsInVzZXJfbmFtZSI6Ik5hdGhhbmllbCBCcm93biIsImVtYWlsIjoibmF0aGFuaWVsX2Jyb3duXzQ3N0BnbWFpbC5jb20iLCJzdGFja2hvbGRlcl90aXRsZSI6IkNSQiIsInJvbGVfaWQiOjEsInJvbGVfdGl0bGUiOiJBRE1JTiJ9.eyR-IqVpVr1wN-xzIaaz9VjrxdUch6RFBcjf8n3zXOM",
};
export const data = {
    count: 2,
    next: null,
    previous: null,
    results: [
        {
            id: 1,
            session: "admin",
            name: "teste",
            email: "admin@gmail.com",
            password:
                "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
            is_staff: false,
            is_superuser: false,
            is_active: false,
            role: {
                id: 1,
                title: "admin",
                name: "admin",
                description: null,
            },
            stackholder: {
                id: 1,
                title: "teste",
                name: "teste",
                description: null,
            },
        },
        {
            id: 2,
            session: "admin2",
            name: "admin",
            email: "admin2@gmail.com",
            password:
                "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
            is_staff: false,
            is_superuser: false,
            is_active: true,
            role: {
                id: 1,
                title: "admin",
                name: "admin",
                description: null,
            },
            stackholder: {
                id: 1,
                title: "teste",
                name: "teste",
                description: null,
            },
        },
    ],
};
