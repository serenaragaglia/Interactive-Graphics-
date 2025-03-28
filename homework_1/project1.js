function composite(bgImg, fgImg, fgOpac, fgPos) {

    /* we need to compute the position of the image in respect to the background, 
    so we shall iterate on every pixel of the foreground in order to map every foreground pixel on the right spot of the background.
    To do we use the offset of the foreground, which tells us how much the image is "moved" */
    for (let y = 0; y < fgImg.height; y++) {
      for (let x = 0; x < fgImg.width; x++) {
        const x_back = x + fgPos.x;
        const y_back = y + fgPos.y;
  
       //This check is used to see if and which pixels are out of the background, in this way we can ignore them
        if (x_back < 0 || x_back >= bgImg.width || y_back < 0 || y_back >= bgImg.height) {
          continue;
        }
  
        /*An image is composed by a certain number of pixels and each pixel has four values, each per channel (R,G,B,A), 
        these values are contained inside a linear array with lenght : columns x rows x 4. 
        We want to know the indeces of the array that correspond to a certain pixel (x, y) */
        const index_foreground = (y * fgImg.width + x) * 4;
        const index_background = (y_back * bgImg.width + x_back) * 4;
        
        //extract the position of each pixel value for each channel, for both the foreground and the background
        const red_fg = fgImg.data[index_foreground];
        const green_fg = fgImg.data[index_foreground + 1];
        const blue_fg = fgImg.data[index_foreground + 2];
        const a_fg = fgImg.data[index_foreground + 3];
  
        const red_bg = bgImg.data[index_background];
        const green_bg = bgImg.data[index_background + 1];
        const blue_bg = bgImg.data[index_background + 2];
        const a_bg = bgImg.data[index_background + 3];
  
        // In order to do the blending we need to normalize the pixel values from the renge [0, 255] to [0,1]
        const alpha_fg = (a_fg / 255) * fgOpac;
        const alpha_bg = a_bg / 255;
  
        //Application of the alpha blending formula
        const alpha = alpha_fg + alpha_bg * (1 - alpha_fg);

        let r, g, b;
        //if alpha is 0 we're allowed to not do the division 
        if (alpha > 0) { 
          r = (red_fg * alpha_fg + red_bg * alpha_bg * (1 - alpha_fg)) / alpha;
          g = (green_fg * alpha_fg + green_bg * alpha_bg * (1 - alpha_fg)) / alpha;
          b = (blue_fg * alpha_fg + blue_bg * alpha_bg * (1 - alpha_fg)) / alpha;
        } else {
          r = 0;
          g = 0;
          b = 0;
        }
  
        //We need to update the background image, with the normalized new values as integers
        bgImg.data[index_background]= Math.round(r);
        bgImg.data[index_background + 1] = Math.round(g);
        bgImg.data[index_background + 2] = Math.round(b);
        bgImg.data[index_background + 3] = Math.round(alpha * 255);
      }
    }
  }