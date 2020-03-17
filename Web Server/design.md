###########
list_script
###########

The list script will maintain the database that the server can pull from in order to do work.

Once per week, server will update card data.
!- Need to have way to force update if new cards are added, rulings out of date, etc.
!- Need to set a time to update

Once per day, after card update if applicable, update card prices.
!- This will need to be done card by card
!- Need to set a time to update.

#####################
Shopping List Builder
#####################

Take in data inptu from webpage, use data to search against database to output a txt file that will contain a shopping list.
!- Needs to have error handling for missing cards due to data error or misspelling

!- Needs to have option to specify priority of lookup for list: by price, by printing, by art, etc.


----------------------------------------------------------


New design:

Site is for century commander. list script will only update prices and cards once a quater. Doing it this way won't effect the shopping list (and I may need to keep two databases, one for current prices in the shopping list and one for the deck checker...)