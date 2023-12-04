import sqlite3


#create connection to database
conn = sqlite3.connect('../../cve.db')
cursor = conn.cursor()