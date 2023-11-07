import json
import os
import sys
import sqlite3

class Database:
    def __init__(self, file: str, src_directory = None: str):
        """Pass in .db file or directory containing .db; src_directory specifies where cve list is located if db still needs to be intialized"""
        self.file = file
        self.cve_directory = src_directory
        if (self.file.endswith('.db')):
            if self.check_database(self.file):
                #connect to sql
                connection = sqlite3.connect(self.file)
            else:
                self.initialize_db()
        else:
            root, dirs, files = os.walk('.db', topdown=False)
            for f in files:
                if f.endswith('.db'):
                    if self.check_database(db_file):
                        #connect to sql
                        connection = sqlite3.connect(self.file)
                    else:
                        self.initialize_db()
                        
                break

    def check_database(self. file) -> bool:
        """Checks if database has been initialized or not and if it needs to be """
        if os.stat(self.file).st_size > 0:
            return True
        else:
            if self.cve_directory == None:
                raise Exception('.db file is empty and CVE Directory is not given')
            else:
                return False

    def intialize_db(self):
        pass


    def load_database(self):
        pass
