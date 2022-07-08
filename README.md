# Ebarimt API

Энэхүү сан нь https://gitlab.com/endigo/ebarimt сервертэй холбогдсон

## Тохиргоо

1. [endigo](https://gitlab.com/endigo/ebarimt) серверийн тохиргооны зааврыг харна уу
2. Ebarimt санг татах: `npm install ebarimt`
3. Ebarimt -ийн client загвар үүсгэх:

```js
import { EbarimtClient } from 'ebarimt';

export const client = new EbarimtClient('http://localhost:8000');
```

4. Сервисийг эхлүүлэх: `await client.init()`
5. Дуудагдах боломжтой API -ууд: `getInformation, put, returnBill, sendData`

## API лавлагаа

Энэхүү багц нь Typescript `.d.ts` файлуудийг болон JSDoc тайлбаруудыг агуулсан.

Илүү дэлгэрэнгүй мэдээлэл авахыг хүсвэл [Pos API reference](https://ebarimt.mn/img/Pos%20API%202.1.2%20User%20Guide_mn.pdf) -г зорино уу

# Ebarimt API

This library integrates with this server: https://gitlab.com/endigo/ebarimt

## Setup

1. Please check setup instructions of [endigo's server](https://gitlab.com/endigo/ebarimt)
2. Install Ebarimt library: `npm install ebarimt`
3. Create ebarimt client instance:

```js
import { EbarimtClient } from 'ebarimt';

export const client = new EbarimtClient('http://localhost:8000');
```

4. Initialize service: `await client.init()`
5. Now you can call available APIs: `getInformation, put, returnBill, sendData`

## API reference

This package includes Typescript `.d.ts` files as well as JSDoc annotations.

For more detailed information please check [Pos API reference](https://ebarimt.mn/img/Pos%20API%202.1.2%20User%20Guide_mn.pdf)
