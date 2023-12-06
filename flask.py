from flask import Flask, render_template, request
import sqlite3 as sql
app = Flask(__name__)   

@app.route('/')
def home():
   return render_template('home.html')

@app.route('/getrange')
def get_range(lower_bound : int, upper_bound : int): 
   con = sql.connect("cve.db")
   cur = con.cursor()
   cur.execute("SELECT * FROM cve LIMIT ? OFFSET ?", ((upper_bound - lower_bound), lower_bound))

   result = cur.fetchall();
   return render_template("get_range.html", result = result)
   

@app.route('/filter')
def filter(cve_id : str = None, title : str = None, description : str = None, attack_comp : str = None,
           avail_impact : str = None, base_score : str = None, base_severity : str = None, confid_impact : str = None,
           privelages : str = None, date = None):
   
   #initial declarations
   filters = [cve_id, title, description, attack_comp, avail_impact, base_score, base_severity, confid_impact, privelages, date]
   statements = ["cve_id", "title", "description", "attack_compleity", "availability_impact", 
                 "base_score", "base_severity", "confidentiality_impact", "privelages_required", "date"]
   equals_string = " = "

   #get all filters that were passed something
   for i in filters:
      if i != None:
         temp = equals_string + '"' + i + '"'
         statements[filters.index(i)] += temp

   #construct query
   query = "SELECT * FROM cve WHERE "
   for i in statements:
      if i.__contains__("="):
         query += i + " AND "
   query = query[:-5]

   #actually do the work and return results
   con = sql.connect("cve.db")
   cur = con.cursor()
   cur.execute(query)
   result = cur.fetchall();
   return render_template("filter.html", result)

@app.route('/last_5_bs_graph')
def last_5_bs_graph():
   years = ["2017", "2018", "2019", "2020", "2021", "2022"]
   data = []
   bases = ['Low', 'Medium', 'High', 'Critical']
   con = sql.connect("cve.db")
   cur = con.cursor()
   for year in years:
        temp_list = []
        for base in bases:
            temp_year = "%" + year + "%"
            cur.execute("SELECT * FROM cve WHERE cve_id LIKE ? AND base_severity LIKE ?", (temp_year, base))
            result = cur.fetchall();
            temp_list.append(len(result))
        data.append(temp_list)
   final_data = []
   for i in range(len(data)):
      final_data.append([years[i], data[i]])
   return render_template('last5bsgraph.html', final_data)

@app.route('/num_cves_by_year')
def num_cves_by_year():
   years = ["1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", 
            "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", 
            "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"]
   data = []
   con = sql.connect("cve.db")
   cur = con.cursor()
   for year in years:
      temp_year = "%" + year + "%"
      cur.execute("SELECT COUNT(*) FROM cve WHERE cve_id LIKE ?", (temp_year,))
      result = cur.fetchone();
      data.append(result[0])
   final_data = []
   for i in range(len(data)):
      final_data.append([years[i], data[i]])
   return render_template('numcveperyear.html', final_data)

@app.route('/avg_base_by_year')
def avg_base_by_year():
   years = ["1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", 
            "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", 
            "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"]
   data = []
   con = sql.connect("cve.db")
   cur = con.cursor()
   for year in years:
      temp_year = "%" + year + "%"
      cur.execute("SELECT avg(base_score) FROM cve WHERE cve_id LIKE ? AND base_score IS NOT NULL", (temp_year,))
      result = cur.fetchone();
      data.append(result[0])
   final_data = []
   for i in range(len(data)):
      final_data.append([years[i], data[i]])
   return render_template('avgbaseyear.html', final_data)

@app.route('/base_score_10_by_year')
def base_score_10_by_year():
   years = ["1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", 
         "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", 
         "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"]
   data = []
   con = sql.connect("cve.db")
   cur = con.cursor()
   for year in years:
      temp_year = "%" + year + "%"
      cur.execute("SELECT COUNT(*) FROM cve WHERE cve_id LIKE ? AND base_score = 10", (temp_year, ))
      result = cur.fetchone();
      data.append(result[0])
   final_data = []
   for i in range(len(data)):
      final_data.append([years[i], data[i]])
   return render_template('base10year.html', final_data)

@app.route('/complex_by_year')
def complex_by_year():
   years = ["1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", 
         "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", 
         "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"]
   data = []
   bases = ['Low', 'High']
   con = sql.connect("cve.db")
   cur = con.cursor()
   for year in years:
      temp_list = []
      for base in bases:
         temp_year = "%" + year + "%"
         cur.execute("SELECT * FROM cve WHERE cve_id LIKE ? AND attack_complexity LIKE ?", (temp_year, base))
         result = cur.fetchall();
         temp_list.append(len(result))
      data.append(temp_list)
   final_data = []
   for i in range(len(data)):
      final_data.append([years[i], data[i]])
   return render_template('complexperyear.html', final_data)

@app.route('/availability_by_year')
def availability_by_year():
   years = ["1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", 
         "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", 
         "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"]
   data = []
   bases = ['Low', 'High']
   con = sql.connect("cve.db")
   cur = con.cursor()
   for year in years:
      temp_list = []
      for base in bases:
         temp_year = "%" + year + "%"
         cur.execute("SELECT * FROM cve WHERE cve_id LIKE ? AND availability_impact LIKE ?", (temp_year, base))
         result = cur.fetchall();
         temp_list.append(len(result))
      data.append(temp_list)
   final_data = []
   for i in range(len(data)):
      final_data.append([years[i], data[i]])
   return render_template('availabilityperyear.html', final_data)

if __name__ == '__main__':
   app.run(debug = True)