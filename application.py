from flask import Flask

app = Flask(__name__)


data = data = {
    'siteName': 'nerdymark.com',
    'posts': [
        {'createdDate': '2021-06-02 19:03:00',
         'title': 'Hello!!!',
         'description': 'This is my new home'},
        ]
    }


@app.route('/')
def hello_world():
    body = "<p>Welcome to {}</p>".format(data['siteName'])

    for post in data['posts']:
        body = body + "<h2 class='title'>{}</h2><div class='post'>{}</div><div class='date'>{}</div>".format(
            post['title'], post['description'], post['createdDate']
        )
    return body


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
