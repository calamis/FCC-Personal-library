/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const Book = require("../model/book.js");

module.exports = function (app) {
  app
    .route("/api/books")
    .get(async (req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      // console.log(req.body)

      try {
        const allBooks = await Book.find({});
        res.json(
          allBooks.map((obj) => {
            const data = {
              _id: obj._id,
              title: obj.title,
              commentcount: obj.comments.length,
            };
            return data;
          })
        );
      } catch (e) {
        return res.json(e);
      }
    })

    .post(async (req, res) => {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title

      try {
        if (!title) {
          return res.json("missing required field title");
        }

        // set data
        const newBook = new Book({
          title: title,
          comment: [],
        });

        // Save data
        await newBook.save((error, data) => {
          if (error) throw error;
          return res.json({
            title: data.title,
            _id: data._id,
          });
        });
      } catch (error) {
        res.json(error);
      }
    })

    .delete(async (req, res) => {
      //if successful response will be 'complete delete successful'
      try {
        await Book.deleteMany();
        return res.json("complete delete successful");
      } catch (error) {
        res.json(error);
      }
    });

  app
    .route("/api/books/:id")
    .get(async (req, res) => {
      let bookid = req.params.id.toString();
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        const getBookById = await Book.findById(bookid);

        if (!getBookById) {
          return res.json("no book exists");
        }

        return res.json({
          title: getBookById.title,
          _id: getBookById._id,
          comments: getBookById.comments,
        });
      } catch (error) {
        return res.json("no book exists");
      }
    })

    .post(async (req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get

      try {
        if (!comment) {
          return res.json("missing required field comment");
        }

        const bookTobeUpdated = await Book.findByIdAndUpdate(
          bookid,
          { $push: { comments: { comment } } },
          { new: true }
        );

        if (!bookTobeUpdated) {
          return res.json("no book exists");
        }

        let commentToBeSent = [];

        bookTobeUpdated.comments.forEach((dataToBeAdd) => {
          commentToBeSent.push(dataToBeAdd.comment);
        });

        return res.json({
          title: bookTobeUpdated.title,
          _id: bookTobeUpdated._id,
          comments: commentToBeSent,
          commentcount: bookTobeUpdated.comments.length,
        });
      } catch (error) {
        return res.json("no book exists");
      }
    })

    .delete(async (req, res) => {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'

      try {
        const bookTobeDeleted = await Book.findByIdAndDelete(bookid);
        if (!bookTobeDeleted) {
          return res.json("no book exists");
        }

        return res.json("delete successful");
      } catch (error) {
        return res.json(error);
      }
    });
};
