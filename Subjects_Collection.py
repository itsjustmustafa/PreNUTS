# In python 3?

import bs4 as bs
import urllib.request
import re
import json
import time

#The Subj class Subj(subject_code, subject_name, **kwargs)
class Subj:
    def __init__(self, code, name, **kwargs):
        self.name = name # name of the subject
        self.code = code # code of the subject

        #Prerequisites of the subject
        self.preReq = [] 

        #TOoPer - The Opposite of Prerequisites (aka postrequisites, postoptional, dependancy etc) of the subject
        self.tooPer = []

        #If A is a Prerequisite in B, B is a Tooper in A
        
        for name, value in kwargs.items():
            setattr(self, name, value)

#Each Faculty and its url code:
faculty = ['ads',#0: Analytics and Data Science
           'bus',#1: Business
           'comm',#2: Communication
           'cii',#3: Creative Intelligence and Innovation
           'dab',#4: On The Haters
           'edu',#5: Education
           'eng',#6: Engineering
           'health',#7: Health
           'health-gem',#8: Heath (GEM)
           'it',#9: Information Technology
           'intl',#10: International Studies
           'law',#11: Law
           'sci',#12: Science
           'tdi']#13: Transdiciplinary Innovation


subList = []#The list of Subjects


for facNum in range(len(faculty)):
    #The page for the numerical list of the subjects, given a faculty
    source = urllib.request.urlopen('http://www.handbook.uts.edu.au/%s/lists/numerical.html' %(faculty[facNum])).read()
    soup = bs.BeautifulSoup(source, 'lxml')
    

    #Searches for text which start with 5 digits - This is the Subject Code
    for line in soup.text.split('\n'):
        if re.search('^\d{5}', line):
            
            code = re.search('^\d{5,6}', line).group(0)#First 5 digits are Subject Code
            name = re.search('(?<=\d{5}\s).+', line).group(0)#Remaining text is the Subject Name

            #Adds Subject to the Subject List
            subList.append(Subj(code, name))

    print('Got Subjects for', faculty[facNum])
    
    
print('Got all the Subjects')


#Searches for Subjects by subject code or name, defaults to returning a list of Subj instances
def querySubjects(query, disp = False):#disp = True -> Prints out Subjects (code and name)
    result = []#List of Subj instances
    for i in subList:
        if query.lower() in i.code+' '+i.name.lower():
            if disp:
                print(i.code,':',i.name,'\n')
            else:
                result.append(i)
    if not(disp):
        return result



    
def getPrereq(inputCode):
    validCode = False
    index = None
    for i in range(len(subList)):
        if subList[i].code == inputCode:
            validCode = True
            index = i
            break

    if not validCode:
        print("Invalid code:", inputCode)
        #print("Please Enter A Valid Code")
        return()

    try:#try to find the subject site for the inputted subject
        subjectSource = urllib.request.urlopen('http://handbook.uts.edu.au/subjects/%s.html' %(inputCode)).read()

    except:#if it doesnt exist, return this message
        print('Error on:', inputCode)
        return()
    
    subjectSoup = bs.BeautifulSoup(subjectSource, 'lxml')

    #Find the line of text describing the Pre-Requisites
    for line in subjectSoup.find_all('em'):
        if re.search('Requisite\(s\)',str(line)):

            #For all matches of 5 or 6 digits, add it as a Pre-Requisite for the current subject
            for preCode in re.findall('\d{5}(?=\.html)', str(line)):
                if not(preCode) in subList[index].preReq:#Only add it if it has not already been added
                    subList[index].preReq.append(preCode)

                #Adds the current subject as a Post-Requisite for this subject's Branch
                for preSub in subList:
                    if preSub.code == preCode and not(inputCode in preSub.tooPer):#Only add it if it has not already been added
                        preSub.tooPer.append(inputCode)
        

def createSubjectJSON():
    for i in range(len(subList)):
        getPrereq(subList[i].code)
        if(i%100 == 0):
            loaded = round(i*100/len(subList), 2)
            loadingBar = '#'*int(loaded*30/100) + '-'*int(30 - loaded*30/100 +1)
            print("%s%% Complete"%(str(round(i*100/len(subList), 2)))+'\t'+loadingBar)


    subDictArr = []
    
    for i in subList:
        subDictArr.append(i.__dict__)
        
    subjectJsonText = json.dumps(subDictArr, indent = 4)

    filename = input("Name the json file: ")

    filename = filename[:filename.find(".json")]
    
    subjectJsonFile = open(filename+'.json', 'w')

    subjectJsonFile.write(subjectJsonText)

    subjectJsonFile.close()
    
    
