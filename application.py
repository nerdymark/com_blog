from flask import Flask

app = Flask(__name__)


data = {
    'siteName': 'nerdymark.com',
    'posts': [
        {'createdDate': '2021-05-26 16:45:00',
         'title': 'Test',
         'description': 'This is a test post'},
        {'createdDate': '2021-05-21 12:00:00',
         'title': 'Test 2',
         'description': "Another test..."}
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
    app.run()
