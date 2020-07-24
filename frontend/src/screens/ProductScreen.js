import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { detailsProduct,saveProductReview } from '../actions/productActions';
import Rating from '../components/rating';
import { productSaveReducer } from '../reducers/productReducers';
import { PRODUCT_REVIEW_SAVE_RESET } from '../constants/productConstants';

function ProductScreen(props) {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState(0)
  const userSignin = useSelector(state => state.userSignin)
  const {userInfo} = userSignin
  const productDetails = useSelector(state => state.productDetails);
  const { product, loading,  error } = productDetails;
 const productSaveReview = useSelector(state => state.productSaveReview)
 const {success: productSaveSuccess} = productSaveReview
  const dispatch = useDispatch();

  useEffect(() => {

    if(productSaveSuccess){
      alert("Review submitted successfully")
      setRating(0)
      setComment('')
      dispatch({type: PRODUCT_REVIEW_SAVE_RESET})
    }
    dispatch(detailsProduct(props.match.params.id));
    return () => {
      //
    };
  }, []);

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(saveProductReview(props.match.params.id, {
      name: userInfo.name,
      rating: rating,
      comment: comment
    })
    )
  }

  const handleAddToCart = () => {
    props.history.push("/cart/" + props.match.params.id + "?qty=" + qty)
  }

  return <div>
    <div className="back-to-result">
      <Link to="/">Back to result</Link>
    </div>
    {loading ? <div>Loading...</div> :
      error ? (<div>{error} </div> 
      ) : (
        <>
          <div className="details">

            <div className="details-image">
              <img src={product.image} alt="product" ></img>
            </div>
            <div className="details-info">
              <ul>
                <li>
                  <h4>{product.name}</h4>
                </li>
                <li>
                <Rating value={product.rating} text={product.numReviews}></Rating>

          </li>
                <li>
                  Price: <b>Rs.{product.price}</b>
                </li>
                <li>
                  Description:
            <div>
                    {product.description}
                  </div>
                </li>
              </ul>
            </div>
            <div className="details-action">
              <ul>
                <li>
                  Price: {product.price}
                </li>
                <li>
                  Status: {product.countInStock > 0 ? "In Stock" : "Unavailable."}
                </li>
                <li>
                  Qty: <select value={qty} onChange={(e) => { setQty(e.target.value) }}>
                    {[...Array(product.countInStock).keys()].map(x =>
                      <option key={x + 1} value={x + 1}>{x + 1}</option>
                    )}
                  </select>
                </li>
                <li>
                  {product.countInStock > 0 && <button onClick={handleAddToCart} className="button-signin" >Add to Cart</button>
                  }
                </li>
              </ul>
            </div>
          </div>
        <div className = "content-margined">
        {!product.reviews.length && <div>No Reviews</div>}

          <ul className = "review">
            {product.reviews.map(review => (
              <li key = {review._id}>
                <div>
                  {review.name}
                </div>
                <div>
                  <Rating value = {review.rating}></Rating>
                </div>
                <div>
                  {review.createdAt.substring(0, 10)}
                </div>
                <div>
                  {review.comment}
                </div>
              </li>
            ))}
            <li>
              <h2>Reviews</h2>
              <h3>Write a customer review</h3>
              {userInfo ? <form onSubmit = {submitHandler}>
                <ul className = "form-container">
                  <li>
                    <label htmlFor = "rating">
                      Rating
                    </label>
                    <select name="rating" id="rating" value={rating} onChange = {(e) => setRating(e.target.value)}>
                      <option value = "1">1-Poor</option>
                      <option value = "2">2-Fair</option>
                      <option value = "3">3-Good</option>
                      <option value = "4">4-Very Good</option>
                      <option value = "5">5-Excellent</option>
                    </select>
                  </li>
                  <li>
                    <label htmlFor = "comment">Comment</label>
                    <textarea name = "comment" value = {comment} onChange = {(e) => setComment(e.target.value)}>

                    </textarea>
                  </li>
                  <li>
                    <button type="submit" className = "button-signin">
                      Submit
                    </button>
                  </li>
                </ul>
              </form>:
              <div>
                Please <Link to= "/signin">Signin</Link> to write a review
              </div> }
            </li>
          </ul>
        </div>
        </>
        )}
</div>
}
export default ProductScreen;