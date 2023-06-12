from flask import Flask, request, jsonify, send_from_directory, render_template
from flask_talisman import Talisman
from flask_apscheduler import APScheduler
import platform, datetime

import os
import random
import json

csp = {
 'default-src': [
        '\'self\'',
        '\'unsafe-inline\'',
        '\'unsafe-eval\'',
        'nerdymark.com',
        'www.nerdymark.com',
        'fonts.googleapis.com',
        'fontawesome.com',
        'kit.fontawesome.com',
        'googlesyndication.com',
        'pagead2.googlesyndication.com',
        'www.googletagmanager.com',
        'analytics.google.com',
        'fonts.gstatic.com',
        'adservice.google.com',
        'doubleclick.net',
        'googleads.g.doubleclick.net',
        'csi.gstatic.com',
        'partner.googleadservices.com',
        'ka-f.fontawesome.com',
        'www.google-analytics.com',
        'tpc.googlesyndication.com',
        'www.google.com',
        'stats.g.doubleclick.net',
    ]
}

dummy_pages = []

# load posts.json
with open('posts.json') as json_file:
    data = json.load(json_file)[0]

with open('dummy_posts.json') as json_file:
    dummy_data = json.load(json_file)

for post in dummy_data:
    dummy_pages.append(post['title'])

post_titles = [post['title'] for post in data['posts']]
adsense_pub_id = data['siteAdsense']

# Collect 404 data
not_found_data = []

print("Now serving {} dummy pages".format(len(dummy_pages)))

application = Flask(__name__)
Talisman(application, content_security_policy=csp)

imgExtension = ["png", "jpeg", "jpg"] #Image Extensions to be chosen from
allImages = list()

def chooseRandomImage(directory="static/mark_art"):
    for img in os.listdir(directory): #Lists all files
        ext = img.split(".")[len(img.split(".")) - 1]
        if (ext in imgExtension):
            allImages.append(img)
    choice = random.randint(0, len(allImages) - 1)
    chosenImage = allImages[choice] #Do Whatever you want with the image file
    return '/static/mark_art/' + chosenImage

@application.route('/', methods=['GET'])
def hello_world():
    randomImage = chooseRandomImage()
    sorted_posts = sorted(data['posts'], key=lambda k: k['createdDate'], reverse=True)
    filtered_posts = [post for post in sorted_posts if post['promoted'] is True]
   
    return render_template('base.html', siteName=data['siteName'], posts=filtered_posts, randomImage=randomImage)

@application.route('/post/<int:post_id>', methods=['GET'])
def post(post_id):
    post = [post for post in data['posts'] if post['id'] == post_id][0]
    return render_template('single.html', post=post, siteName=data['siteName'])

@application.route('/category/<string:category>', methods=['GET'])
def category(category):
    posts = [post for post in data['posts'] if post['category'] == category]
    return render_template('base.html', posts=posts, siteName=data['siteName'])

@application.route('/contact', methods=['GET'])
def contact():
    return render_template('contact.html', siteName=data['siteName'])

@application.route('/about', methods=['GET'])
def about():
    return render_template('about.html', siteName=data['siteName'])

@application.route('/robots.txt', methods=['GET'])
def robots():
    return send_from_directory('static', 'robots.txt')

@application.route('/images/<path:path>', methods=['GET'])
def send_images(path):
    return send_from_directory('static/images', path)

@application.route('/resume', methods=['GET'])
def resume():
    return render_template('resume.html', siteName=data['siteName'])

@application.route('/404', methods=['GET'])
def not_found():
    return application.response_class(json.dumps(not_found_data, indent=4), mimetype='application/json')

@application.route('/ads.txt', methods=['GET'])
def ads():
    ads_text = 'google.com, {}, DIRECT, f08c47fec0942fa0'.format(adsense_pub_id)
    return application.response_class(ads_text, mimetype='text/plain')
    

@application.route('/<string:page_title>', methods=['GET'])
def router(page_title):
    if page_title in dummy_pages:
        post_date = datetime.datetime.now().strftime("%B %d, %Y")
        post_data = [post for post in dummy_data if post['title'] == page_title][0]
        post_data['createdDate'] = post_date

        return render_template('dummy.html', siteName=data['siteName'], post=post_data)


@application.errorhandler(404)
def page_not_found(e):
    # Get URL from request
    url = request.url
    remote_addr = request.remote_addr

    # Add URL to not_found_data
    not_found_data.append({remote_addr: url})
    
    # Parse URL to get path
    url_path = url.split('://')[1].split('/')[1]

    # If path is a post, redirect to post
    if url_path in post_titles:
        post = [post for post in data['posts'] if post['title'] == url_path][0]
        return render_template('single.html', post=post, siteName=data['siteName'])
    
    else:
        data_404 = {
            'siteName': 'nerdymark.com',
            'siteDescription': 'nerdymark.com is a blog about technology, programming, and other nerdy things.',
            'siteAuthor': 'Mark',
            'posts': [
                {'id': 1,
                'createdDate': datetime.datetime.now(),
                'title': '420, Page Not Found',
                'description': 'I could not find your page, dude.',
                'category': 'errors'},
                ]
            }
        return render_template('base.html', siteName=data_404['siteName'], posts=data_404['posts']), 404

if __name__ == '__main__':
    application.run(debug=True, use_reloader=False)
