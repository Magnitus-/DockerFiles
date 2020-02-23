docker build -t pyspark-jupyter-notebook:latest .;
docker run -d --rm -p "8888:8888" --name pyspark-jupyter-notebook pyspark-jupyter-notebook:latest;