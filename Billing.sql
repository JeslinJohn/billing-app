create database billing;
use billing;
drop database product;

create table product(
product_id int not null,
serial_no int not null,
product_name varchar(25) not null,
product_quantity int not null,
product_price int not null,
total_price int not null,
Unique(serial_no, product_id,product_name)
);

select * from product;
insert into product values(456,1,"",1,30,30);
delete from product where product_id = 456;
drop table product;
truncate table product;

create table employee(
id int auto_increment not null,
first_name varchar(255) not null,
last_name varchar(255) not null,
email varchar(255) not null,
username varchar(255) not null,
password varchar(255) not null,
role varchar(255) not null,
Primary key (id)
);
select * from employee;
INSERT into employee VALUES (1,"Ben","Rial@123");
update employee
SET
password = "$2a$12$uIWEovKDbDV7LATdjkhMn.FbgOzjpwE7MrjvtYO1I.N7e/Lee5tlS" WHERE id = 2;
drop table employee;
delete from employee where id = 1;

create table token(
id int(255) Auto_increment Primary key,
token Varchar(255) not null unique,
logged_out boolean not null default false,
user_id Int not null,
Foreign key(user_id) References employee(id)
On delete cascade
);

select * from token;
Truncate table token;
