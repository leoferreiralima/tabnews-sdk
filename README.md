<center>

# TabNews SDK

[![CI](https://github.com/leoferreiralima/tabnews-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/leoferreiralima/tabnews-sdk/actions/workflows/ci.yml)
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

const contents = await tabNews.contents.getAll();
```
