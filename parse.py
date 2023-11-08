import json
import os
import sys
import sqlite3

class Database:
    def __init__(self, file: str, src_directory: str = None):
        """Pass in .db file or directory containing .db; src_directory specifies where cve list is located if db still needs to be intialized"""
        self.file = file
        self.cve_directory = src_directory
        if (self.file.endswith('.db')):
            if self.check_database():
                #connect to sql
                connection = sqlite3.connect(self.file)
            else:
                #db not initialized
                self.initialize_db()
        else:
            root, dirs, files = os.walk('.db', topdown=False)
            for f in files:
                if f.endswith('.db'):
                    self.file = f
                    if self.check_database():
                        #connect to sql
                        connection = sqlite3.connect(self.file)
                    else:
                        #db not initialized
                        self.initialize_db()
                        
                break

    def check_database(self) -> bool:
        """Checks if database has been initialized or not and if it needs to be """
        if os.stat(self.file).st_size > 0:
            return True
        else:
            if self.cve_directory == None:
                raise Exception('.db file is empty and CVE Directory is not given')
            else:
                return False

    def initialize_db(self):
        """Creates database and tables"""
        connection = sqlite3.connect(self.file)
        cursor = connection.cursor()
        cursor.execute('''CREATE TABLE IF NOT EXISTS cve
                        (cve_id text PRIMARY KEY NOT NULL, title text, description text, attack_complexity text, availability_impact text,
                        base_score int, base_severity text, confidentiality_impact text, priveleges_required text,
                        discovery text,  date text)''')
        cursor.execute('''CREATE TABLE IF NOT EXISTS cve_references
                        (reference text, cve_id text, FOREIGN KEY (cve_id) REFERENCES cve(cve_id))''')
        connection.commit()
        connection.close()

    def load_database(self):
        for root, dirs, files in os.walk(self.cve_directory):
            for f in files:
                if f.endswith('.json'):
                    with open(f, 'r') as cve_file:
                        cve_json = json.load(cve_file)

if __name__ == "__main__":
    test = Database("cve.db", "cvelistV5-main")
