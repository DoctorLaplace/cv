function printPDF() {

    $(function() {
        $('body').scrollTop(0);
     });

    // Source can be HTML-formatted string, or a reference
    // to an actual DOM element from which the text will be scraped.
    var source = $('#resume-content')[0];

    source.style.fontFeatureSettings = '"liga" 0';

    var divHeight = source.clientHeight;
    var divWidth = source.clientWidth;

    // New jsPDF in portrait and millimeter unit
    var doc = new jsPDF('p', 'mm');

    // Set the margin in mm
    var margin = 10;

    // Set imageWidth in mm, excluding the margin
    var imgWidth = 210 - 2 * margin;

    // Set pageHeight in mm, excluding the margin
    var pageHeight = 324 - 2 * margin;

    var getAuthorName = function () {
        const metas = document.getElementsByTagName('meta');

        for (let i = 0; i < metas.length; i++) {
            if (metas[i].getAttribute('name') === 'author') {
                return metas[i].getAttribute('content');
            }
        }
        return '';
    }
    var getPageCanvas = function (canvas, pageWidth, pageHeight, pageNo) {
        var pageImageWidth = canvas.width;
        var pageImageHeight = pageHeight * pageImageWidth / pageWidth;

        var ctx = canvas.getContext('2d');
        var buffer = ctx.getImageData(0, pageNo * pageImageHeight, pageImageWidth, pageImageHeight);
        var pageCanvas = document.createElement('canvas');
        pageCanvas.width = pageImageWidth;
        pageCanvas.height = pageImageHeight;
        var pageCanvasCtx = pageCanvas.getContext('2d');
        pageCanvasCtx.putImageData(buffer, 0, 0);

        return pageCanvas;
    };

    html2canvas(source, {
        height: divHeight,
        width: divWidth,
        scrollX: 0,
        scrollY: -window.scrollY
    }).then(canvas => {

        var pageImageWidth = canvas.width;
        var pageImageHeight = pageHeight * pageImageWidth / (imgWidth + 2 * margin);
        var pageImageHeightMM = pageImageHeight / 3.779528;
        var pages = Math.ceil(pageImageHeightMM / pageHeight);

        var pageCanvas, contentDataURL, imgHeight;
        for (i = 0; i < pages; i++) {
            pageCanvas = getPageCanvas(canvas, (imgWidth + 2 * margin), pageHeight, i);
            contentDataURL = pageCanvas.toDataURL('image/png');
            imgHeight = pageCanvas.height * imgWidth / pageCanvas.width;
            if (i > 0) {
                doc.addPage();
            }
            doc.addImage(contentDataURL, 'PNG', margin, margin, imgWidth, imgHeight, '', 'FAST');
        }

        doc.save(getAuthorName() + ' Resume.pdf');

    });

}
