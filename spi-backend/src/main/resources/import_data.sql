insert into app_user(id, email, password) values (-1, "user1@email.com", "password");
insert into app_user(id, email, password) values (-2, "user2@email.com", "password");

insert into account(id, number, recipient_name, recipient_address, creator_id) values (-1, "111-11-11", "PDV", "Some address 1", -1);
insert into account(id, number, recipient_name, recipient_address, creator_id) values (-2, "222-22-22", "Donation", "Some address 2", -1);
insert into account(id, number, recipient_name, recipient_address, creator_id) values (-3, "333-33-33", "Research", "Some address 3", -1);

insert into account(id, number, recipient_name, recipient_address, creator_id) values (-4, "444-44-44", "Breast cancer research", "Address 1", -2);


insert into article(id, name, price, user_id) values (-1, "cappucino", 150, -1);
insert into article(id, name, price, user_id) values (-2, "vodavoda", 50, -1);
insert into article(id, name, price, user_id) values (-3, "plazma", 120, -1);