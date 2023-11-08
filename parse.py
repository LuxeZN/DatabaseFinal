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
                self.load_database()
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
                        self.load_database()
                        
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
                        cve_id = cve_json['containers']['cna']['x_legacy_V4Record']['CVE_data_meta']['ID']
                        cve_title = cve_json['containers']['cna']['x_legacy_V4Record']['CVE_data_meta']['TITLE']
                        cve_desc = cve_json['containers']['cna']['x_legacy_V4Record']['description']['descriptiondata'][0]['value']
                        cve_attack = cve_json['containers']['cna']['x_legacy_V4Record']['impact']['cvss']['attackComplexity']
                        cve_availability = cve_json['containers']['cna']['x_legacy_V4Record']['impact']['cvss']['availabilityImpact']
                        cve_base_score = cve_json['containers']['cna']['x_legacy_V4Record']['impact']['cvss']['baseScore']
                        cve_base_severity = cve_json['containers']['cna']['x_legacy_V4Record']['impact']['cvss']['baseSeverity']
                        cve_confidentiality = cve_json['containers']['cna']['x_legacy_V4Record']['impact']['cvss']['confidentialityImpact']
                        cve_privileges = cve_json['containers']['cna']['x_legacy_V4Record']['impact']['cvss']['privilegesRequired']
                        cve_discovery = cve_json['containers']['cna']['x_legacy_V4Record']['source']['discovery']
                        cve_date = cve_json['containers']['cna']['x_legacy_V4Record']['CVE_data_meta']['DATE_PUBLIC']
                        cve_references = cve_json['containers']['cna']['x_legacy_V4Record']['references']['reference_data']
                        connection = sqlite3.connect(self.file)
                        cursor = connection.cursor()
                        cursor.execute('''INSERT INTO cve VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''', 
                        (cve_id, cve_title, cve_desc, cve_attack, cve_availability, 
                        cve_base_score, cve_base_severity, cve_confidentiality, cve_privileges, cve_discovery, cve_date))
                        cursor.execute('''INSERT INTO cve_references VALUES (?, ?)''', (cve_references, cve_id))


if __name__ == "__main__":
    test = Database("cve.db", "cvelistV5-main")
