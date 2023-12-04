from flask import Flask, render_template, request
import sqlite3 as sql
app = Flask(__name__)   

@app.route('/')
def home():
   return render_template('home.html')

@app.route('/enternew')
def new_student():
   return render_template('student.html')

@app.route('/getrange')
def get_range(lower_bound : int, upper_bound : int): 
   con = sql.connect("cve.db")
   cur = con.cursor()
   cur.execute("SELECT * FROM cve LIMIT ? OFFSET ?", ((upper_bound - lower_bound), lower_bound))

   result = cur.fetchall()
   return render_template("getrange.html", result = result)
   

@app.route('/filter')
def filter():
   con = sql.connect("cve.db")
   con.row_factory = sql.Row
   
   cur = con.cursor()
   cur.execute("select * from students")
   
   rows = cur.fetchall()
   return render_template("list.html",rows = rows)

if __name__ == '__main__':
   app.run(debug = True)