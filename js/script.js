'use strict';

/*
document.getElementById('test-button').addEventListener('click', function(){
  const links = document.querySelectorAll('.titles a');
  console.log('links:', links);
});
*/

const templates = {
  // eslint-disable-next-line no-undef
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  // eslint-disable-next-line no-undef
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  // eslint-disable-next-line no-undef
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  // eslint-disable-next-line no-undef
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tagcloud-link').innerHTML),
  // eslint-disable-next-line no-undef
  authorCloudLink: Handlebars.compile(document.querySelector('#template-authorcloud-link').innerHTML)
};

const titleClickHandler = function(event){
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');

  /* [DONE] remove class 'active' from all article links  */

  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  /* [DONE] add class 'active' to the clicked link */
  /*console.log('clickedElement (with plus): ' + clickedElement);*/
  console.log('clickedElement:', clickedElement);
  clickedElement.classList.add('active');

  /* [DONE] remove class 'active' from all articles */

  const activeArticles = document.querySelectorAll('.post.active');
  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
  /* get 'href' attribute from the clicked link */

  const articleSelector = clickedElement.getAttribute('href');
  console.log('articleSelector and getAttribute:', articleSelector);

  /* find the correct article using the selector (value of 'href' attribute) */

  const targetArticle = document.querySelector(articleSelector);
  console.log('targetArticle', targetArticle);

  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
  console.log('targetArticle', targetArticle);

};

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleTagSelector = 'a[href^="#tag-"]', //optArticleTagSelector = '.post-tags a',
  optArticleAuthorSelector = '.post-author',
  optArticleAuthorSelectorLink = 'a[href^="#author-"]', //optArticleAuthorSelectorLink = '.post-author a',
  optTagsListSelector = '.tags',
  optAuthorsListSelector = '.list.authors',
  optCloudClassCount = 5;
  //optCloudClassPrefix = 'tag-size-';

function generateTitleLinks(customSelector = ''){

  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';
  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  console.log('articles', articles);

  let html = '';
  for(let article of articles){
    /* get the article id */
    const articleId = article.getAttribute('id');
    console.log('articleId', articleId);

    /* find the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    console.log('articleTitle', articleId);

    /* create HTML of the link */
    //const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    //console.log('linkHTML', linkHTML);
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);

    /* insert link into titleList */
    /*titleList.insertAdjacentHTML('beforebegin', linkHTML);
console.log('titleList', titleList); */
    html = html + linkHTML;
    //console.log('html', html);
  }
  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');
  console.log('links', links);
  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function calculateTagsParams(tags){
  const params = {
    max : 0,
    min: 999999
  };
  for(let tag in tags){
    //console.log(tag + ' is used ' + tags[tag] + ' times ');

    if(tags[tag] > params.max){
      params.max = tags[tag];
      //console.log('params.max:', params.max);
    }
    if(tags[tag] < params.min){
      params.min = tags[tag];
      //console.log('params.min:', params.min);
    }
  }
  return params;
}

function calculateTagClass(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );
  return classNumber;
}

function generateTags(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);

  /* START LOOP: for every article: */
  for (let article of articles) {

    /* find tags wrapper */
    const taglist = article.querySelector(optArticleTagsSelector);

    /* make html variable with empty string */
    let html = '';

    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    /* split tags into array */

    const articleTagsArray = articleTags.split(' ');
    /* START LOOP: for each tag */
    for(let tag of  articleTagsArray){
      //console.log('tag:', tag);

      /* generate HTML of the link */
      //const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      const linkHTMLData = {id: tag,title: tag};
      const linkHTML = templates.tagLink(linkHTMLData);

      /* add generated code to html variable */
      html = html + linkHTML;

      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags.hasOwnProperty(tag)){ // eslint-disable-line
        /* [NEW] add generated code to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }

    /* END LOOP: for each tag */
    }

    /* insert HTML of all the links into the tags wrapper */
    taglist.innerHTML = html;

  /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector);
  const tagsParams = calculateTagsParams(allTags);
  //console.log('tagsParams:', tagsParams);

  /*[NEW] create variable for all links HTML code*/
  const allTagsData = {tags: []};

  /* [NEW] START LOOP: for each tag in allTags: */
  for (let tag in allTags) {
    /*[NEW] generate code of a link and add it to allTagsHTML */
    //const tagLinkHTML = '<li class ="tag-size-' + calculateTagClass(allTags[tag], tagsParams) +'">' + tag + '</li>' + ' ';
    //const tagLinkHTML = '<li><a class ="tag-size-' + calculateTagClass(allTags[tag], tagsParams) +'" href="#tag-' + tag + '">' + tag + '</a></li>' + ' ';

    //allTagsHTML += tagLinkHTML;
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });

  }
  /* [NEW] END LOOP: for each tag in allTags: */

  /* [NEW] add html from allTags to tagList */
  //tagList.innerHTML = allTagsHTML;
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  //console.log('allTagsHTML:', allTagsData);
}

function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  console.log('this', this);

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');

  /* find all tag links with class active */
  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');

  /* START LOOP: for each active tag link */
  for(let activeTag of activeTags){

    /* remove class active */
    activeTag.classList.remove('active');

  /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinks = document.querySelectorAll('a[href^="#tag-' + tag + '"]');

  /* START LOOP: for each found tag link */
  for(let tagLink of tagLinks){

    /* add class active */
    tagLink.classList.add('active');
    console.log('tagLink', tagLink);

  /* END LOOP: for each found tag link */
  }

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* find all links to tags */
  const tagLinks = document.querySelectorAll(optArticleTagSelector, optArticleTagsSelector);

  /* START LOOP: for each link */
  for (let tag of tagLinks) {

    /* add tagClickHandler as event listener for that link */
    tag.addEventListener('click', tagClickHandler);

  /* END LOOP: for each link */
  }
}

function calculateAuthorsParams(authors) {
  const params = {
    max: 0,
    min: 999999
  };
  for (let author in authors) {
    if (authors[author] > params.max) {
      params.max = authors[author];
    }
    if (authors[author] < params.min) {
      params.min = authors[author];
    }
  }
  return params;
}

function calculateAuthorClass(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );
  return classNumber;
}

function generateAuthors(){
  /* [NEW] create a new variable allAuthors with an empty object */
  let allAuthors = {};
  /* find all authors */
  const authorArticles = document.querySelectorAll(optArticleSelector);

  /* START LOOP: for every authors: */
  for (let authorArticle of authorArticles) {
    /*console.log('author',author);*/

    /* find author wrapper */
    const authorList = authorArticle.querySelector(optArticleAuthorSelector);
    console.log('authorList:', authorList);

    /* make html variable with empty string */
    let html = '';

    /* get tags from data-tags attribute */
    const articleAuthor = authorArticle.getAttribute('data-author');
    //const linkHTML = '<li><a href="#author-' + articleAuthor + '">' + articleAuthor  + '</a></li>';

    const linkHTMLData = {id: articleAuthor,title: articleAuthor};
    const linkHTML = templates.authorLink(linkHTMLData);

    html = html + linkHTML;
    if (!allAuthors.hasOwnProperty(articleAuthor)) {// eslint-disable-line
      /* [NEW] add generated code to allAuthors array */
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }
    /* insert HTML of all the links into the author wrapper */
    authorList.innerHTML = html;

    /* END LOOP: for every author: */
  }
  /* [NEW] find list of authors in right column */
  const authorCloudList = document.querySelector('.authors');
  const authorParams = calculateAuthorsParams(allAuthors);
  //let allAuthorsHTML = ' ';
  const allAuthorsData = {authors: []};

  //console.log('allAuthorsHTML:', allAuthorsHTML);
  /* [NEW] START LOOP: for each author in allAuthors: */
  for (let articleAuthor in allAuthors) {
    /*[NEW] generate code of a link and add it to allTagsHTML */
    //const authorLinkHTML = '<li><a class ="tag-size-' + calculateAuthorClass(allAuthors[articleAuthor], authorParams) +'" href="#author-' + articleAuthor + '">' + articleAuthor + '</a></li>' + ' ';
    //console.log('authorLinkHTML:', authorLinkHTML);
    //allAuthorsHTML += authorLinkHTML;
    allAuthorsData.authors.push({
      author: articleAuthor,
      count: allAuthors[articleAuthor],
      className: calculateAuthorClass(allAuthors[articleAuthor], authorParams)
    });
  }
  /* [NEW] add html from allAuthors to authorList */
  authorCloudList.innerHTML = templates.authorCloudLink(allAuthorsData);
  //console.log('allAuthorsHTML:', allAuthorsData);
}

function authorClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* make a new constant "author" and extract tag from the "href" constant */
  const author = href.replace('#author-', '');

  /* find all tag links with class active */
  const activeAuthors = document.querySelectorAll('a.active[href^="#author-"]');

  /* START LOOP: for each active author link */
  for (let activeAuthor of activeAuthors) {
    /* remove class active */
    activeAuthor.classList.remove('active');

    /* END LOOP: for each active author link */

  }
  /* find all auithor links with "href" attribute equal to the "href" constant */
  const authorLinks = document.querySelectorAll('a[href^="#author-' + author + '"]');

  /* START LOOP: for each found author link */
  for (let authorLink of authorLinks) {
    authorLink.classList.add('active');

  }
  /* execute function "generateTitleLinks" with author selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors(){
  /* find all links to tags */
const linksToAuthors = document.querySelectorAll(optArticleAuthorSelectorLink);
//const linksToAuthors = document.querySelectorAll(optArticleAuthorSelectorLink + optAuthorsListSelector);

  /* START LOOP: for each link */
  for (let author of linksToAuthors) {

    /* add tagClickHandler as event listener for that link */
    author.addEventListener('click', authorClickHandler);
    //console.log('author:',author);
  }
  /* END LOOP: for each link */
}

generateTags();
addClickListenersToTags();
generateAuthors();
addClickListenersToAuthors();
