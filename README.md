<!-- @format -->

<h1 align="center">
  Entrega - Users Service
</h1>

<p align="center">
  <a href="#endpoints">Endpoints</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</p>

## **Endpoints**

A API tem um total de 4 endpoints, aplicação capaz de realizar registro, login, listar e atualizar usuários.<br/>

## Rotas que não precisam de autenticação

<h2 align ='center'> Criação de usuários </h2>

`POST /signup - FORMATO DA REQUISIÇÃO`

```json
{
  "age": 18,
  "username": "daniel",
  "email": "daniel@kenzie.com",
  "password": "abcd"
}
```

Caso dê tudo certo, a resposta será assim:

`POST /signup - FORMATO DA RESPOSTA - STATUS 201`

```json
{
  "uuid": "4b72c6f3-6d0a-(X)6a1-86c6-687d52de4fc7",
  "createdOn": "2021-11-18T01:23:52.910Z",
  "email": "daniel@kenzie.com",
  "age": 18,
  "username": "daniel"
}
```

<h2 align ='center'> Possível erro </h2>

Dados inválidos(sem idade):

`POST /signup - `
` FORMATO DA RESPOSTA - STATUS 422`

```json
{
  "message": "age is a required field"
}
```

<h2 align ='center'> Gera um token JWT recebendo username e password no corpo da requisição como JSON. </h2>

`POST /login - FORMATO DA REQUISIÇÃO`

```json
{
  "username": "lucas",
  "password": "abcd"
}
```

Caso dê tudo certo, a resposta será assim:

`POST /signup - FORMATO DA RESPOSTA - STATUS 201`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI.eyJ1c2VybmFtZSI6Imx1Y2FzIijc4ZGE2N2VhLTMw2EtNDYxOC1imOWFkZDY1MiIsImlhdCI6MTYzNzXhwIjoxNjM3MjAyMjQyfQ._XIs736ET7wEMJ5Ldvcsjqsg4Nvs40mM"
}
```

## Rota que precisa de autenticação

<h2 align ='center'> Listar os usuários. </h2>

`GET /users - FORMATO DA RESPOSTA - STATUS 200`

```json
[
  {
    "username": "Lucas",
    "age": 21,
    "email": "lucas@kenzie.com",
    "password": "$2a$10$jz95yeryjhoRd1okKfEkHOOiC3RY0EPeDU6C/ccqFoa6GXE868qm6",
    "createdOn": "2022-03-16T16:42:53.801Z",
    "uuid": "076bd8bd-9534-49bb-9977-3a914a0ca0ff"
  }
]
```

<h2 align = "center"> Atualiza a senha do usuário, rebendo uma string e gerando hash novamente para a nova string.</h2>

`PUT /users/:uuid/password- FORMATO DA REQUISIÇÃO`

```json
{
  "password": "0000000"
}
```

Caso dê tudo certo, a resposta será assim:

`PUT /users/:uuid/password - FORMATO DA RESPOSTA - STATUS 204`

```json
No body returned for response
```

---

Feito com ♥ by maria-baia :wave:
