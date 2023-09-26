<center>

# TabNews SDK

[![CI](https://github.com/leoferreiralima/tabnews-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/leoferreiralima/tabnews-sdk/actions/workflows/ci.yml)
[![Coverage](https://codecov.io/gh/leoferreiralima/tabnews-sdk/graph/badge.svg?token=1UWW7T20RY)](https://codecov.io/gh/leoferreiralima/tabnews-sdk)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=leoferreiralima_tabnews-sdk&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=leoferreiralima_tabnews-sdk)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=leoferreiralima_tabnews-sdk&metric=bugs)](https://sonarcloud.io/summary/new_code?id=leoferreiralima_tabnews-sdk)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=leoferreiralima_tabnews-sdk&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=leoferreiralima_tabnews-sdk)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=leoferreiralima_tabnews-sdk&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=leoferreiralima_tabnews-sdk)

</center>

Esse projeto foi criado com o intuito de fornecer uma interface amigável de intergração com o [tabnews](https://www.tabnews.com.br/)

## Sumário

- [Instalação](#instalação)
- [Exemplos](#exemplos)
  - [TabNews](#tabnews)
  - [Sessão](#sessão)
  - [Conteúdos](#conteúdos)

## Instalação

Para começar a usar o tabnews-sdk dentro do seu projeto basta instalar com o seu
gerenciador de pacotes favorito

```
$ npm install tabnews-sdk
```

```
$ yarn add tabnews-sdk
```

```
$ pnpm add tabnews-sdk
```

## Exemplos

Para iniciar o cliente do basta instanciar a classe TabNews, as credencias são opcionais,
mas podem ser setadas por um arquivo `.env` ou direto no código conforme abaixo

### TabNews

**Instanciar sem credentials**

```js
import { TabNews } from 'tabnews-sdk';

const tabNews = new TabNews();
```

**Instanciar com credentials no arquivo .env**

```js
import { TabNews } from 'tabnews-sdk';

const tabNews = new TabNews();
```

```properties
TABNEWS_CREDENTIALS_EMAIL=<seu email>
TABNEWS_CREDENTIALS_PASSWORD=<sua senha>
```

**Instanciar com credentials no código**

```js
import { TabNews } from 'tabnews-sdk';

const tabNews = new TabNews({
  credentials: {
    email: '<seu email>',
    password: '<sua senha>',
  },
});
```

### Sessão

A sessão tem dois métodos `create` e `destroy`, após a criação da sessão
a biblioteca ira gerenciar automaticamente a sessão criando uma nova quando houver
expiração do token, caso deseje consultar a api sem uma sessão apenas não chame o
método `create`, contudo algumas rotas gerarão erros por falta de permissão

**Exemplo com sessão gerenciada**

```js
import { TabNews } from 'tabnews-sdk';

const tabNews = new TabNews();

const session = await tabNews.session.create(); // sessão criada

const contents = await tabNews.contents.getAll();

await tabNews.session.destroy(); // sessão destruida
```

**Exemplo com sessão não gerenciada**

```js
import { TabNews } from 'tabnews-sdk';

const tabNews = new TabNews();

const { contents } = await tabNews.contents.getAll();
```

### Usuário

A api de usuários permite que buscar dados do usuário logado, atualizar e listar.

**Buscar usuário logado**

```js
import { TabNews } from 'tabnews-sdk';

const tabNews = new TabNews();

await tabNews.session.create();

const user = await tabNews.user.me();
```

### Conteúdos

A api conteúdos permite listar todos os posts/comentários dentro
do tabnews, alguns dos exemplos de como interagir com essa api está abaixo:

**Buscar Conteúdos**

```js
import { TabNews } from 'tabnews-sdk';

const tabNews = new TabNews();

const { pagination, contents } = await tabNews.contents.getAll();
```

**Buscar Conteúdos Paginados**

```js
import { TabNews } from 'tabnews-sdk';

const tabNews = new TabNews();

const { pagination, contents } = await tabNews.contents.getAll({
  page: 1,
  per_page: 30,
  strategy: 'relevant',
});
```

```js
import { TabNews } from 'tabnews-sdk';

const tabNews = new TabNews();

const { pagination, contents } = await tabNews.contents.getAll({
  page: 2,
  per_page: 50,
  strategy: 'relevant',
});

const prevContents = await tabNews.contents.getAll({
  page: pagination.previous_page,
  per_page: 50,
  strategy: 'relevant',
});

const nextContents = await tabNews.contents.getAll({
  page: pagination.next_page,
  per_page: 50,
  strategy: 'relevant',
});
```

**Criar Conteúdo**

Na rota de criação de conteúdos, todos os campos são opcionais exceto o `body`,
que é o seu post ou comentario, e o `title` que é opcional apenas quando há um `parent_id`

```js
import { TabNews } from 'tabnews-sdk';

const tabNews = new TabNews();

await tabNews.session.create();

const response = await tabNews.contents.create({
  parent_id: undefined,
  slug: 'e-opcional',
  title: 'test',
  body: 'test',
  status: 'published',
  source_url: 'https://google.com',
});
```

```js
import { TabNews } from 'tabnews-sdk';

const tabNews = new TabNews();

const { contents } = await tabNews.contents.getAll();

await tabNews.session.create();

const response = await tabNews.contents.create({
  parent_id: contents[0].id,
  body: 'comentando em um conteúdo',
  status: 'published',
});
```
