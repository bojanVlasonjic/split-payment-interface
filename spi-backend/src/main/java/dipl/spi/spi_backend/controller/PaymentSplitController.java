package dipl.spi.spi_backend.controller;

import dipl.spi.spi_backend.dto.PaymentSplitDto;
import dipl.spi.spi_backend.service.PaymentSplitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/payment-split")
public class PaymentSplitController {

    @Autowired
    private PaymentSplitService paymentSplitService;

    @GetMapping("/{articleId}")
    public ResponseEntity<List<PaymentSplitDto>> getPaymentSplitsForArticle(@PathVariable Long articleId) {
        return ResponseEntity.ok(paymentSplitService.getPaymentSplitsForArticle(articleId));
    }

    @PostMapping
    public ResponseEntity<PaymentSplitDto> createPaymentSplit(@RequestBody PaymentSplitDto paymentSplitDto) {
        return new ResponseEntity<>(
                paymentSplitService.createPaymentSplit(paymentSplitDto),
                HttpStatus.CREATED
        );
    }

    @PutMapping
    public ResponseEntity<PaymentSplitDto> updatePaymentSplit(@RequestBody PaymentSplitDto paymentSplitDto) {
        return new ResponseEntity<>(
                paymentSplitService.updatePaymentSplit(paymentSplitDto),
                HttpStatus.OK
        );
    }

}
