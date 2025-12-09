create database billing;
use billing;
drop database product;

create table product(
product_id int primary key not null,
serial_no int not null,
product_name varchar(25) not null,
product_quantity int not null,
product_price int not null,
total_price int not null
);

select * from product;
insert into product values(456,1,"Tooth Brush",1,30,30);
delete from product where product_id = 456;