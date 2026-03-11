-- CreateTable
CREATE TABLE "User" (
    "id_user" SERIAL NOT NULL,
    "login" VARCHAR(50) NOT NULL,
    "pass" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "surname" VARCHAR(50),
    "phone" VARCHAR(20),
    "email" VARCHAR(100) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "courses" (
    "id_cours" SERIAL NOT NULL,
    "course_name" VARCHAR(255) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id_cours")
);

-- CreateTable
CREATE TABLE "status" (
    "id_status" INTEGER NOT NULL,
    "name_status" VARCHAR(50) NOT NULL,

    CONSTRAINT "status_pkey" PRIMARY KEY ("id_status")
);

-- CreateTable
CREATE TABLE "orders" (
    "id_order" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pay" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "feedback" TEXT,
    "start_date" VARCHAR(20),
    "payment_method" VARCHAR(50),
    "id_cours" INTEGER NOT NULL,
    "id_status" INTEGER NOT NULL DEFAULT 1,
    "id_user" INTEGER NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id_order")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_id_cours_fkey" FOREIGN KEY ("id_cours") REFERENCES "courses"("id_cours") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_id_status_fkey" FOREIGN KEY ("id_status") REFERENCES "status"("id_status") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
