/* eslint-disable @typescript-eslint/restrict-template-expressions */


function createComment(fields) {
  fetch('/api/comment/', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse); // typically this would have a separate error handler 
}

function viewAllComments(fields) {
  fetch(`/api/comment?freet=${fields.freetId}`)
    .then(showResponse)
    .catch(showResponse);
}

function deleteComment(fields) {
  fetch(`/api/comment/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}
