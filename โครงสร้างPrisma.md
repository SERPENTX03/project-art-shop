//import prisma from "@/config/db";
ในการใช้
generator client {
provider = "prisma-client-js"
}

datasource db {
provider = "mongodb"
url = env("DATABASE_URL")
}

enum Role {
USER
ADMIN
}

enum GalleryStatus {
PENDING
APPROVED
REJECTED
}

enum PaymentStatus {
PENDING
PAID
FAILED
}

enum PaymentProvider {
STRIPE
OMISE
}

enum PayoutStatus {
PENDING
PAID
FAILED
}

enum AddressType {
HOME
WORK
}

enum DeliveryStatus {
PENDING
PROCESSING
SHIPPED
DELIVERED
CANCELLED
}

enum ReturnStatus {
REQUESTED
APPROVED
RECEIVED
REFUNDED
REJECTED
}

model User {
id String @id @default(auto()) @map("\_id") @db.ObjectId
clerkId String @unique
email String
profileImage String
firstName String?
lastName String?
username String?
role Role @default(USER)
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
galleries Gallery[]
orders Order[]
artist ArtistProfile[]
carts Cart[]
Address Address[]
Favorite Favorite[]
Reaction Reaction[]
}

model Address {
id String @id @default(auto()) @map("\_id") @db.ObjectId
user User @relation(fields: [userId], references: [clerkId])
userId String

fullName String
phone String

province String
district String
subDistrict String
postalCode String

addressLine String

type AddressType @default(HOME)

isDefault Boolean @default(false)
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}

model Cart {
id String @id @default(auto()) @map("\_id") @db.ObjectId
user User @relation(fields: [userId], references: [clerkId])
userId String
items CartItem[]
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}

model CartItem {
id String @id @default(auto()) @map("\_id") @db.ObjectId
cart Cart @relation(fields: [cartId], references: [id])
cartId String @db.ObjectId
gallery Gallery @relation(fields: [galleryId], references: [id])
galleryId String @db.ObjectId
quantity Int @default(1)
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

@@unique([cartId, galleryId])
}

model Payout {
id String @id @default(auto()) @map("\_id") @db.ObjectId
amount Float
status PayoutStatus @default(PENDING)
transferredAt DateTime?
note String?
paidAt DateTime?

artist ArtistProfile @relation(fields: [artistId], references: [id])
artistId String @db.ObjectId

order Order? @relation(fields: [orderId], references: [id])
orderId String? @db.ObjectId

gallery Gallery? @relation(fields: [galleryId], references: [id])
galleryId String? @db.ObjectId

createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}

model ArtistProfile {
id String @id @default(auto()) @map("\_id") @db.ObjectId
name String @unique
bio String?
avatar String?
phone String
bankName String?
accountName String?
accountNumber String?
promptpayId String?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
user User @relation(fields: [userId], references: [clerkId])
userId String
Gallery Gallery[]
Payout Payout[]
Post Post[]
}

model Post {
id String @id @default(auto()) @map("\_id") @db.ObjectId
artist ArtistProfile @relation(fields: [artistId], references: [id])
artistId String @db.ObjectId

title String
content String?
images String[]

createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

//Reaction
Reaction Reaction[]
}

model Reaction {
id String @id @default(auto()) @map("\_id") @db.ObjectId

post Post @relation(fields: [postId], references: [id])
postId String @db.ObjectId
user User @relation(fields: [userId], references: [clerkId])
userId String

emoji String
createdAt DateTime @default(now())

@@unique([postId, userId, emoji])
}

model Gallery {
id String @id @default(auto()) @map("\_id") @db.ObjectId
title String
description String?
price Float
quantity Int @default(1)
images String[]
imageAdmin String[]

status GalleryStatus @default(PENDING)
rejectReasons String[]
soldCount Int @default(0)
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

user User @relation(fields: [userId], references: [clerkId])
userId String
categories GalleryCategoryOnGallery[]
orderItems OrderItem[]
artist ArtistProfile? @relation(fields: [shopManageId], references: [id])
payout Payout[]
shopManageId String? @db.ObjectId
CartItem CartItem[]
Favorite Favorite[]
}

model Favorite {
id String @id @default(auto()) @map("\_id") @db.ObjectId
user User @relation(fields: [userId], references: [clerkId])
userId String
gallery Gallery @relation(fields: [galleryId], references: [id])
galleryId String @db.ObjectId
createdAt DateTime @default(now())

@@unique([userId, galleryId])
}

model GalleryCategory {
id String @id @default(auto()) @map("\_id") @db.ObjectId
name String @unique
galleries GalleryCategoryOnGallery[]
}

model GalleryCategoryOnGallery {
id String @id @default(auto()) @map("\_id") @db.ObjectId
gallery Gallery @relation(fields: [galleryId], references: [id])
galleryId String @db.ObjectId
category GalleryCategory @relation(fields: [categoryId], references: [id])
categoryId String @db.ObjectId
}

model Order {
id String @id @default(auto()) @map("\_id") @db.ObjectId
user User @relation(fields: [userId], references: [clerkId])
userId String
total Float
status PaymentStatus @default(PENDING)
stripeId String? // payment intent ID
omiseId String? // omise charge ID

shippingFullName String?
shippingPhone String?
shippingAddressLine String?
shippingSubDistrict String?
shippingDistrict String?
shippingProvince String?
shippingPostalCode String?
createdAt DateTime @default(now())

items OrderItem[]
Payout Payout[]
}

model OrderItem {
id String @id @default(auto()) @map("\_id") @db.ObjectId
order Order @relation(fields: [orderId], references: [id])
orderId String @db.ObjectId
gallery Gallery @relation(fields: [galleryId], references: [id])
galleryId String @db.ObjectId
paidToShop Boolean @default(false)
quantity Int
unitPrice Float

deliveryStatus DeliveryStatus @default(PENDING)

trackingNumber String?
shippedAt DateTime?
deliveredAt DateTime?

returnRequested Boolean @default(false)
returnReason String?
returnStatus ReturnStatus?

returnImages String[]
returnNote String?
}
