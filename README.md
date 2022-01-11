# Biosentiers-CS-functionality

BioSenCS is a biodiversity CS project that we developed with the following objectives:

* Simplify data validation by automatically validating bird observations using ML algorithms

* Improve data quality through automatic filtering

* Give the participants real-time machine-generated feedback

* Encourage user engagement as a result of automatic feedback

* Increase participants’ knowledge about biodiversity using machine-generated feedback

* Improve data quality as a result of automatic feedback

![Alt Text](https://github.com/mlotfian/Biosentiers-CS-functionality/blob/master/biosen.gif)


### Requirements:

```
pip install -r requirements.txt
```
Additional requirements to consider before running installing the requirements.txt:

* Visual C++ redistribuable (Build tools)

* PostgreSQL (make sure path to pg_config executable is set in the PATH environment variable)

* PostGis + activate postgis extension in pgSQL database

* OSGeo4W installed with gdal202.dll driver  (32bit)


### To Launch:

```
python manage.py runserver
```

