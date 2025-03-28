// bgImg is the background image to be modified.
// fgImg is the foreground image.
// fgOpac is the opacity of the foreground image.
// fgPos is the position of the foreground image in pixels. It can be negative and (0,0) means the top-left pixels of the foreground and background are aligned.
function composite( bgImg, fgImg, fgOpac, fgPos )
{
    /*find out the position of the foregorund in respect to the position of the background 
        in order to know if they are aligned*/
        let i; let j;
        for (i = 0; i < fgImg.height; i++){
            for (j = 0; j < fgImg.width; j++){
                const back_x = j + fgPos.x;
                const back_y = i + fgPos.y;

                //computation of the indeces of both images
                const fg_index = (j * fgImg.width + i) * 4;
                const bg_index = (back_y * bgImg.width + back_x) * 4;

                //take all pixels values corresponding to the different channels
                const r_fg = fgImg.data[fg_index];
                const g_fg = fgImg.data[fg_index + 1];
                const b_fg = fgImg.data[fg_index + 2];
                const a_fg = fgImg.data[fg_index + 3];

                const r_bg = bgImg.data[bg_index];
                const g_bg = bgImg.data[bg_index + 1];
                const b_bg = bgImg.data[bg_index + 2];
                const a_bg = bgImg.data[bg_index + 3];

                //normalization of the to get the range [0,1] of the values
                const alpha_fg = (a_fg / 255) * fgOpac;
                const alpha_bg = (a_bg /255);

                let alpha = alpha_fg + (1 - alpha_fg)*alpha_bg;

                let r, g, b;
                if (alpha > 0){
                    r = (r_fg * alpha_fg + [(1 - alpha_fg)*alpha_bg*r_bg]) / alpha;
                    g = (g_fg * alpha_fg + [(1 - alpha_fg)*alpha_bg*g_bg]) / alpha;
                    b = (b_fg * alpha_fg + [(1 - alpha_fg)*alpha_bg*b_bg]) / alpha;
                }
            }                    
        }
}
